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
        this.push(JSON.parse(decodedChunk, (key, value)  => {

            if (value !== null &&
                typeof value === 'object' &&
                'type' in value &&
                value.type === 'Buffer' &&
                'data' in value &&
                Array.isArray(value.data)) {
                return new Buffer(value.data);
            }
            return value;
        }));
        callback();
    }
}

module.exports = JsonToObjectTransform;
