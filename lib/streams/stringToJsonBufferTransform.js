'use strict';

const Transform = require('stream').Transform;
const defaults = {
    encoding : 'utf8',
    writableObjectMode : false,
    readableObjectMode : false
};

class StringToJsonBufferTransform extends Transform {

    constructor(options) {

        super(Object.assign({}, options, defaults));
        this._buffer = [];
        this._previousChar = null;
        this._capture = false;
        this._objectDepth = 0;

        this._isEscapeMode = false;
        this._isStringMode = false;
    }

    _transform(chunk, encoding, callback) {

        const decodedChunk = encoding === 'utf8' ? chunk : chunk.toString();

        for (let i=0; i < decodedChunk.length; ++i) {
            let char = decodedChunk[i];

            //Is valid state for beginning or end of string
            if (char === '"' && this._previousChar !== '\\' && this._capture) {
                this._isStringMode = !this._isStringMode;
            }

            //Capture state if beginning of object or array
            if (!this._isStringMode) {
                switch (char) {
                    case '{':
                    case '[':
                        this._capture = true;
                        ++this._objectDepth;
                        break;
                    case '}':
                    case ']':
                        if (this._objectDepth !== 0) {
                            --this._objectDepth;
                        }
                        break;
                }
            }

            //Enqueue things into JSON buffer
            if (this._capture && char !== ' ' && char !== '\t' && char !== '\n') {
                this._buffer.push(char);
                this._previousChar = char;
            }

            //Flush JSON buffer and reset all states
            if (this._capture && this._objectDepth === 0) {
                this.push(this._buffer.join(''));
                this._reset();
            }
        }

        callback();
    }

    _flush(callback) {

        this._reset();
        callback();
    }

    _reset() {

        this._capture = false;
        this._isEscapeMode = false;
        this._isStringMode = false;
        this._previousChar = null;
        this._buffer.length = 0;
    }
}

module.exports = StringToJsonBufferTransform;