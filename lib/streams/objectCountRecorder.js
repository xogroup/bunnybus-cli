'use strict';

const Writable = require('stream').Writable;
const defaults = {
    objectMode : true
};

class ObjectCountRecorder extends Writable {

    constructor(options) {

        super(Object.assign({}, options, defaults));
        this._counter = 0;
        this._currentObject = null;
    }

    get count() {

        return this._counter;
    }

    get currentObject() {

        return this._currentObject;
    }

    _write(chunk, encoding, callback) {

        if (chunk) {
            ++this._counter;
            this._currentObject = chunk;
        }

        this._tryCallback(callback);
    }

    _writev(chunks, callback) {

        chunks.forEach((chunk) => {


            ++this._counter;
            this._currentObject = chunk;
        });

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
