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

Commander
    .version(PackageMeta.version)
    .option('-P, --publish', 'publish a message to an exchange')
    .option('-S, --subscribe', 'subscribe message(s) from a queue')
    .option('-c, --config <path>', 'path to the configuration file')
    .parse(process.argv);

if (!Commander.publish && !Commander.subscribe) {
    const path = Path.isAbsolute(Commander.config)
        ? Commander.config
        : Path.join(process.env.PWD, Commander.config);

    Fs.createReadStream(path).pipe(process.stdout);
}
