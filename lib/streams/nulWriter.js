'use strict';

const Writable = require('stream').Writable;

class NulWriter extends Writable {

    constructor(options) {

        super(options);
    }

    _write(chunk, encoding, callback) { }
};

module.exports = NulWriter;
