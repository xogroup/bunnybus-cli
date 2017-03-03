'use strict';

const Writable = require('stream').Writable;
const defaults = {
    objectMode : true
};

class ObjectCountRecorder extends Writable {

    constructor(options) {

        super(Object.assign({}, options, defaults));
        this._counter = 0;
    }

    get count() {

        return this._counter;
    }

    _write(chunk, encoding, callback) {

        if (chunk) {
            ++this._counter;
        }

        this._tryCallback(callback);
    }

    _writev(chunks, callback) {

        chunks.forEach(() => ++this._counter);

        this._tryCallback(callback);
    }

    end(chunk, encoding, callback) {

        if (chunk) {
            ++this._counter;
        }

        this.emit('finish');
        this._tryCallback(callback);
    }

    _tryCallback(callback) {

        if (callback) {
            callback();
        }
    }
}

module.exports = ObjectCountRecorder;
