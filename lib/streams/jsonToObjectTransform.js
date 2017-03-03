'use strict';

const Transform = require('stream').Transform;
const defaults = {
    readableObjectMode : true
};

class JsonToObjectTransform extends Transform {

    constructor(options) {

        super(Object.assign({}, options, defaults));
    }

    _transform(chunk, encoding, callback) {

        const decodedChunk = encoding === 'utf8' ? chunk : chunk.toString();
        this.push(JSON.parse(decodedChunk));
        callback();
    }
}

module.exports = JsonToObjectTransform;
