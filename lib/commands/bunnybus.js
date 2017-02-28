#!/usr/bin/env node
'use strict';

const BunnyBus = require('bunnybus');
const Path = require('path');
const Fs = require('fs');
const Commander = require('commander');
const Streams = require('../streams');
const PackageMeta = require('../../package.json');
const StringToJsonBufferTransform = Streams.StringToJsonBufferTransform;
const JsonToObjectTransform = Streams.JsonToObjectTransform;

const pathBuilder = (path) => {

    return Path.isAbsolute(path)
        ? path
        : Path.join(process.env.PWD, path); 
};

Commander
    .version(PackageMeta.version)
    .option('-P, --publish', 'publish a message to an exchange')
    .option('-S, --subscribe', 'subscribe message(s) from a queue')
    .option('-c, --config <path>', 'path to the configuration file')
    .parse(process.argv);

if (!Commander.publish && !Commander.subscribe && Commander.config) {
    Fs.createReadStream(pathBuilder(Commander.config)).pipe(process.stdout);
}

if (Commander.publish) {
    const config = Commander.config ? Fs.readFileSync(pathBuilder(Commander.config)) : null;

    const bunnyBus = new BunnyBus(config);

    const stringToJsonBufferTransform = new StringToJsonBufferTransform();
    const jsonToObjectTransform = new JsonToObjectTransform();

    const pipe = process.stdin
        .pipe(stringToJsonBufferTransform)
        .pipe(jsonToObjectTransform);

    stringToJsonBufferTransform.on('data', console.log);
    jsonToObjectTransform.on('error', console.error);
}
