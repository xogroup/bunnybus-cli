'use strict';

const Readable = require('stream').Readable;
const Exceptions = require('../exceptions');
const BunnyBus = require('bunnybus');
const BunnyHelpers = require('bunnybus/lib/helpers');

const defaults = {
    encoding : 'utf8',
    objectMode : false
};

class BunnyBusGet extends Readable {

    constructor(options) {

        super(Object.assign({}, options, defaults));

        let bunnyBusOptions = null;
        bunnyBusOptions = options ? options.bunnyBus || {} : {};

        if (!bunnyBusOptions.queue) {
            throw new Exceptions.QueueConfigMissingError();
        }

        if (!bunnyBusOptions.queue.name) {
            throw new Exceptions.QueueNameMissingError();
        }

        this._bunnyBus = new BunnyBus(bunnyBusOptions.server);
        this._queueName = bunnyBusOptions.queue.name;
        this._initialized = false;
        this._closed = false;

        this._allocate();
    }

    _read() {

        this._tryPush();
    }

    _tryPush() {

        const self = this;

        const fetch = () => {

            this._bunnyBus.get(this._queueName, (err, payload) => {

                if (err) {
                    throw new Exceptions.OperationError('BUNNYBUS GET');
                }

                if (payload) {
                    this._bunnyBus._ack(payload);
                    const parsedPayload = BunnyHelpers.parsePayload(payload);
                    this.push(JSON.stringify(parsedPayload.message));
                }
                else {
                    this._closed = true;

                    this._bunnyBus._closeConnection(() => {

                        this.push(null);
                        self.emit('close');
                    });
                }
            });
        };

        const retry = () => {

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
            retry();
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
}

module.exports = BunnyBusGet;
