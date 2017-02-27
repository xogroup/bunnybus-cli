'use strict';

const Parser = require('stream-json/Parser');
const parser = new Parser();
const Reader = require('stream').Readable;
const ReadString = require('./readstring');

class StringReader extends Reader {

    constructor(string, options) {
        super(options);
        this._string = string;
    }

    _read(size) {
        this.push(this._string, 'utf8');
        this.push(null);
    }
}

const stringReader = new StringReader('{"a": 1, "b": true, "c": ["d"]}')
const pipeline = stringReader.pipe(parser);

// const pipeline = new ReadString('{"a": 1, "b": true, "c": ["d"]}').pipe(parser);
pipeline.on('data', (chunk) => {
    console.log(chunk);
});
pipeline.on('end', () => {
    console.log('hello world');
});