'use strict';

const Readable = require('stream').Readable;
const defaults = {
    encoding : 'utf8'
};

class StringReader extends Readable {

    constructor(string, options) {
        super(Object.assign({}, options, defaults));
        this._string = string;
    }

    _read(size) {
        this.push(this._string, 'utf8');
        this.push(null);
    }
}

module.exports = StringReader;
