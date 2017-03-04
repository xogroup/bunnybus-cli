'use strict';

const Transform = require('stream').Transform;
const Exceptions = require('../exceptions');
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
        this._previousNonWhitespaceChar = null;
        this._capture = false;
        this._objectDepth = 0;

        this._isEscapeMode = false;
        this._isKeyValueMode = false;
        this._isNotObjectMode = false;
    }

    _transform(chunk, encoding, callback) {

        const decodedChunk = encoding === 'utf8' ? chunk : chunk.toString();

        for (let i = 0; i < decodedChunk.length; ++i) {
            const char = decodedChunk[i];

            //Is valid state for beginning or end of string
            if (!this._isNotObjectMode && char === '"' && this._previousChar !== '\\' && this._capture) {
                this._isKeyValueMode = !this._isKeyValueMode;
            }
            // Capture state for simple JSON string
            else if (char === '"') {

                if (!this._capture) {
                    this._capture = true;
                    this._isNotObjectMode = true;
                    ++this._objectDepth;
                }
                else if (this._capture && this._isNotObjectMode) {
                    --this._objectDepth;
                }
            }

            //Capture state if beginning of object or array
            if (!this._isKeyValueMode) {
                switch (char) {
                    case '{':
                        if (this._previousNonWhitespaceChar === char) {
                            this._reset();
                            return callback(new Exceptions.JsonStringFormatError(i, char));
                        }
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
            if (this._capture) {
                if (this._isKeyValueMode || (char !== ' ' && char !== '\t' && char !== '\n')) {
                    this._buffer.push(char);
                    this._previousNonWhitespaceChar = char;
                }
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
        this._isKeyValueMode = false;
        this._isNotObjectMode = false;
        this._previousChar = null;
        this._previousNonWhitespaceChar = null;
        this._buffer.length = 0;
    }
}

module.exports = StringToJsonBufferTransform;
