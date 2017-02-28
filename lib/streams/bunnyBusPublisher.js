'use strict';

const Writable = require('stream').Writable;
const BunnyBus = require('bunnybus');
const Async = require('async');
const defaults = {
    highWaterMark : 50,
    objectMode : true
};

class BunnyBusPublisher extends Writable {

    constructor(options) {

        super(Object.assign({}, options, defaults));

        let bunnyBusOptions = null;

        if (options) {
            bunnyBusOptions = options.bunnyBus;
        }

        this._bunnyBus = new BunnyBus(bunnyBusOptions);
        this._buffer = [];
    }

    _write(chunk, encoding, callback) {

        this._buffer.push(chunk);
        this._tryFlush(false, callback);
    }

    _writev(chunks, callback) {

        this._buffer.push(chunks.map((item) => item.chunk));

        this._tryFlush(false, callback);
    }

    end(chunk, encoding, callback) {

        this._tryFlush(true, callback);
    }

    _tryFlush(force, callback) {

        if (!force && this._buffer.length < defaults.highWaterMark) {
            if (callback) {
                return callback();
            }
        }

        Async.map(
            this._buffer.splice(0, defaults.highWaterMark),
            (chunk, cb) => this._bunnyBus.publish(chunk, cb),
            (err) =>  {
                if (callback) {
                    callback(err);
                }
            }
        );
    }
}

module.exports = BunnyBusPublisher;
