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
        bunnyBusOptions = options ? options.bunnyBus || {} : {};

        this._bunnyBus = new BunnyBus(bunnyBusOptions.server);
        this._buffer = [];
        this._active = true;
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

        this._active = false;
        this._tryFlush(true, callback);
    }

    _tryFlush(force, callback) {

        const cbReducer = (err) => {

            if (callback) {
                callback(err);
            }
        };

        if (!force && this._buffer.length < defaults.highWaterMark) {
            cbReducer();
            return;
        }

        const self = this;

        Async.map(
            self._buffer.splice(0, defaults.highWaterMark),
            (chunk, cb) => {
                self._bunnyBus.publish(chunk, cb);
            },
            (err) =>  {

                if (!self._active) {
                    self._bunnyBus._closeConnection((err) => {
                        self.emit('close');
                        cbReducer(err);
                    });
                } 
                else {
                    cbReducer(err);
                }
            }
        );
    }
}

module.exports = BunnyBusPublisher;
