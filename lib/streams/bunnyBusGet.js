'use strict';

const Readable = require('stream').Readable;
const Async = require('async');
const Helpers = require('../helpers');
const Exceptions = require('../exceptions');
const StreamLogger = require('../loggers').StreamLogger;
const BunnyBus = require('bunnybus');
const BunnyHelpers = require('bunnybus/lib/helpers');

const defaults = {
    encoding : 'utf8',
    objectMode : false
};

class BunnyBusGet extends Readable {

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

        this._logger = logger;
        this._bunnyBus = new BunnyBus(bunnyBusOptions.server);
        this._queueName = bunnyBusOptions.queue.name;
        this._metaData = options ? options.metaData || false : false;
        this._initialized = false;
        this._closed = false;

        this._allocate();

        process.once('SIGINT', this._destroy.bind(this));
    }

    _read() {

        this._tryPush();
    }

    _tryPush() {

        const self = this;
        const batchSize = 20;

        const fetch = () => {

            Async.times(
                batchSize,
                (n, cb) => this._bunnyBus.get(self._queueName, cb),
                (err, payloads) => {

                    if (err) {
                        throw new Exceptions.OperationError('BUNNYBUS GET');
                    }

                    let payloadCounter = 0;
                    let payload = null;

                    while (payload = payloads.shift()) {
                        if (payload) {
                            ++payloadCounter;
                            this._bunnyBus._ack(payload);
                            const parsedPayload = BunnyHelpers.parsePayload(payload);

                            if (this._metaData) {
                                parsedPayload.process = Helpers.processInfo('get');
                                this.push(JSON.stringify(parsedPayload));
                            }
                            else {
                                this.push(JSON.stringify(parsedPayload.message));
                            }
                        }
                    }

                    if (payloadCounter < batchSize) {
                        this._destroy();
                    }
                }
            );
        };

        const retryFetch = () => {

            const ref = setInterval(() => {

                if (this._initialized) {
                    fetch();
                    clearInterval(ref);
                }
            }, 1);
        };

        if (this._initialized && !this._closed) {
            fetch();
        }
        else if (!this._closed) {
            retryFetch();
        }
    }

    _allocate() {

        this._bunnyBus._autoConnectChannel((err) => {

            if (err) {
                throw new Exceptions.OperationError('BUNNYBUS AUTOCONNECT');
            }
            this._initialized = true;
        });
    }

    _destroy() {

        this._closed = true;

        this._bunnyBus._closeConnection(() => {

            this.push(null);
            this.emit('close');
        });
    }
}

module.exports = BunnyBusGet;
