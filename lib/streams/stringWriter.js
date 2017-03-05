'use strict';

const Writable = require('stream').Writable;
const defaults = {
    encoding : 'utf8',
    objectMode : false
};

class StringWriter  extends Writable {

    constructor() {

        super(defaults);
    }

    _write(chunk, encoding, callback) {

        this.emit('data', chunk.toString());
    }
};

module.exports = StringWriter;
