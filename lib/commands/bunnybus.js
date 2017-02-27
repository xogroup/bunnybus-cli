#!/usr/bin/env node
'use strict';

const Parser = require('stream-json/Parser');
const parser = new Parser();
const Streamer = require('stream-json/Streamer');
const streamer = new Streamer();
const StringReader = new require('./streams/stringReader');
const Writer = require('stream').Writable;
const Reader = require('stream').Readable;

class StdOutWriter extends Writer {
    
    constructor(options) {
        super(options);
    }

    _write(chunk, encoding, callback) {
        console.log('here');;
        if (chunk) {
            process.stdout.write(chunk);
        }
        callback();
    }
}

// const stringReader = new StringReader('{"a": 1, "b": true, "c": ["d"]}')
const stdoutWriter = new StdOutWriter();
// const pipeline = stringReader.pipe(parser);

const pipeline = process.stdin.pipe(parser).pipe(streamer);

pipeline.on('data', (chunk) => {
    console.log(chunk);
});


// process.stdin.setEncoding('utf8');

// process.stdin.pipe(parser);//.pipe(stdoutwriter);

// parser.on('error', (err) => {

//     console.log(err);
// });



// process.stdin.on('readable', () => {
//   var chunk = process.stdin.read();
//   if (chunk !== null) {
//     process.stdout.write('\n===========================\n');
//     process.stdout.write(`${chunk.length}`);
//     process.stdout.write('\n===========================\n');
//   }
// });

// process.stdin.on('data', (chunk) => {

//     if (chunk != null) {
//         process.stdout.write('\n===========================\n');
//         process.stdout.write(`${chunk.length}`);
//         process.stdout.write('\n===========================\n');
//     }
// });

// process.stdin.on('end', () => {
//   process.stdout.write('end');
// });

// process.stdin.pipe(parser).pipe(streamer);
