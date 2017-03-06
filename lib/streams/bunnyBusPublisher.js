'use strict';

const Writable = require('stream').Writable;
const StreamLogger = require('../loggers').StreamLogger;
const BunnyBus = require('bunnybus');
const Async = require('async');
const defaults = {
    highWaterMark : 50,
    objectMode : true
};

class BunnyBusPublisher extends Writable {

    constructor(options, logger = new StreamLogger()) {

        super(Object.assign({}, options, defaults));

        let bunnyBusOptions = null;
        bunnyBusOptions = options ? options.bunnyBus || {} : {};

        this._logger = logger;
        this._bunnyBus = new BunnyBus(bunnyBusOptions.server);
        this._tee = options ? options.tee || false : false;
        this._buffer = [];
        this._active = true;
        this._closeSemaphore = 0;
        this._flushSemaphore = 0;
    }

    _write(chunk, encoding, callback) {

        this._buffer.push(chunk);
        return this._tryFlush('_write', false, callback);
    }

    _writev(chunks, callback) {

        this._buffer.push(...chunks.map((item) => item.chunk));
        return this._tryFlush('_writev', false, callback);
    }

    end(chunk, encoding, callback) {

        this._active = false;
        this._tryFlush('end', true, callback);
    }

    _tryFlush(caller, force, callback) {

        const cbReducer = (err) => {

            if (callback) {
                callback(err);
            }
        };

        const belowHighWaterMark = this._buffer.length < defaults.highWaterMark;

        if (!force && belowHighWaterMark && this._active) {
            cbReducer();
        }
        else {
            const self = this;

            ++this._flushSemaphore;

            Async.map(
                self._buffer.splice(0, defaults.highWaterMark),
                (chunk, cb) => {

                    self._bunnyBus.publish(chunk, cb);

                    if (self._tee) {
                        process.stdout.write(JSON.stringify(chunk) + '\n');
                    }
                },
                (err) =>  {

                    self.emit('drain');
                    --self._flushSemaphore;

                    if (!self._active && self._flushSemaphore === 0 && self._closeSemaphore++ === 0) {
                        self._bunnyBus._closeConnection((err) => {

                            --self._closeSemaphore;
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

        return belowHighWaterMark;
    }
}

module.exports = BunnyBusPublisher;
