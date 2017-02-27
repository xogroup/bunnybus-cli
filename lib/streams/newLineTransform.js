'use strict';

const Transform = require('stream').Transform;
const defaults = {
    encoding : 'utf8',
    writableObjectMode : false,
    readableObjectMode : false
};

class NewLineTransform extends Transform {

    constructor(options) {

        super(Object.assign({}, options, defaults));
    }

    _transform(chunk, encoding, callback) {

        const decodedChunk = encoding === 'utf8' ? chunk : chunk.toString();
        this.push(decodedChunk + '\n');
        callback();
    }
}

module.exports = NewLineTransform;