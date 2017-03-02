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
        this._closeSemaphore = 0;
        this._flushSemaphore = 0;
        // this._counter = 0;
    }

    _write(chunk, encoding, callback) {
// console.log('_write', 'buffer', this._buffer.length);
        this._buffer.push(chunk);
        return this._tryFlush('_write', false, callback);
    }

    _writev(chunks, callback) {
// console.log('_writev', 'buffer', this._buffer.length);
        this._buffer.push(...chunks.map((item) => item.chunk));
        return this._tryFlush('_writev', false, callback);
    }

    end(chunk, encoding, callback) {
// console.log('end', 'buffer', this._buffer.length);
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
            // console.log(caller, 'skipped publishing');
            cbReducer();
        }
        else {
            const self = this;

            ++this._flushSemaphore;

            Async.map(
                self._buffer.splice(0, defaults.highWaterMark),
                (chunk, cb) => {
                    // console.log(caller, 'publishing', 'counter', ++self._counter);
                    self._bunnyBus.publish(chunk, cb);
                },
                (err) =>  {

                    self.emit('drain');
                    --self._flushSemaphore;

                    // console.log(caller, 'drained', 'active', self._active, 'flushSemaphore', self._flushSemaphore, 'closeSemaphore', self._closeSemaphore);
                    if (!self._active && self._flushSemaphore === 0 && self._closeSemaphore++ === 0) {
                        // console.log(caller, 'closing connection', 'closeSemaphore', self._closeSemaphore);
                        self._bunnyBus._closeConnection((err) => {
                            --self._closeSemaphore;
                            // console.log(caller, 'closed connection', 'closeSemaphore', self._closeSemaphore);
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
