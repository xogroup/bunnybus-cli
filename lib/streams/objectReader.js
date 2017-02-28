'use strict';

const Readable = require('stream').Readable;
const defaults = {
    objectMode : true
};

class ObjectReader extends Readable {

    constructor(object, options) {

        super(Object.assign({}, options, defaults));
        this._object = object;
        this._repeat = options ? options.repeat || 1 : 1;
    }

    _read() {

        for (let i = 0; i < this._repeat; ++i) {
            this.push(this._object);
        }

        this.push(null);
    }
}

module.exports = ObjectReader;
