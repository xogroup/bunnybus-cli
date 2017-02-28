'use strict';

const Readable = require('stream').Readable;
const defaults = {
    objectMode : true
};

class ObjectReader extends Readable {

    constructor(object, options) {

        super(Object.assign({}, options, defaults));
        this._object = object;
    }

    _read() {

        this.push(this._object);
        this.push(null);
    }
}

module.exports = ObjectReader;
