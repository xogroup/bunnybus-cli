'use strict';

const Readable = require('stream').Readable;
const Helpers = require('../helpers');
const StreamLogger = require('../loggers').StreamLogger;
const BunnyBus = require('bunnybus');
const Exceptions = require('../exceptions');

const defaults = {
    encoding : 'utf8',
    objectMode : false
};

class BunnyBusSubscriber extends Readable {

    constructor(options, logger = new StreamLogger()) {

        super(Object.assign({}, options, defaults));

        let bunnyBusOptions = null;
        bunnyBusOptions = options ? options.bunnyBus || {} : {};

        if (!bunnyBusOptions.queue) {
            throw new Exceptions.QueueConfigMissingError();
        }

        if (!bunnyBusOptions.queue.name) {
            throw new Exceptions.QueueNameMissingError();
        }

        if (!bunnyBusOptions.queue.routeKey) {
            throw new Exceptions.RouteKeyMissingError();
        }

        this._logger = logger;
        this._buffer = [];
        this._bufferWaterMark = options ? options.bufferWaterMark || 50 : 50;
        this._bunnyBus = new BunnyBus(bunnyBusOptions.server);
        this._queueName = bunnyBusOptions.queue.name;
        this._routeKey = bunnyBusOptions.queue.routeKey;
        this._durationMs = options ? options.durationMs || 0 : 0;
        this._metaData = options ? options.metaData || false : false;
        this._readRequest = 0;

        this._allocate();
        this._closeAfterDuration();

        process.once('SIGINT', this._destroy.bind(this));
    }

    _read() {

        ++this._readRequest;
        this._tryPush();
    }

    _tryPush() {

        while (this._buffer.length !== 0 && this._readRequest !== 0) {
            --this._readRequest;
            this.push(JSON.stringify(this._buffer.shift()));
        }
    }

    _allocate() {

        const handlers = {};

        const belowWatermark = () => this._buffer.length < this._bufferWaterMark;

        const pushMessage = (message, ack) => {

            this._buffer.push(message);
            ack();

            if (this._readRequest > 0) {
                setImmediate(this._tryPush.bind(this));
            }
        };

        const retry = (message, ack) => {

            const ref = setInterval(() => {

                if (belowWatermark()) {
                    pushMessage(message, ack);
                    clearInterval(ref);
                }
            }, 1);
        };

        if (this._metaData) {
            handlers[this._routeKey] = (message, metaData, ack) => {

                if (belowWatermark()) {
                    pushMessage({
                        message,
                        metaData,
                        process : Helpers.processInfo('subscribe')
                    }, ack);
                }
                else {
                    retry(message, ack);
                }
            };
        }
        else {
            handlers[this._routeKey] = (message, ack) => {

                if (belowWatermark()) {
                    pushMessage(message, ack);
                }
                else {
                    retry(message, ack);
                }
            };
        }

        this._bunnyBus.subscribe(this._queueName, handlers, { meta : this._metaData }, (err) => {

            if (err) {
                throw new Exceptions.OperationError('BUNNYBUS SUBSCRIBE');
            }
        });
    }

    _destroy() {

        this._bunnyBus.unsubscribe(this._queueName, () => {

            const self = this;

            const ref = setInterval(() => {

                if (self._buffer.length === 0) {
                    clearInterval(ref);
                    self.push(null);
                    self._bunnyBus._closeConnection(() => {

                        self.push(null);
                        self.emit('close');
                    });
                }
            }, 10);
        });
    }

    _closeAfterDuration() {

        if (this._durationMs > 0) {
            setTimeout(this._destroy.bind(this), this._durationMs);
        }
    }
}

module.exports = BunnyBusSubscriber;
