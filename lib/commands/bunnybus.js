#!/usr/bin/env node
'use strict';

const Fs = require('fs');
const Args = require('commander');
const Helpers = require('../helpers');
const Streams = require('../streams');
const PackageMeta = require('../../package.json');
const StringToJsonBufferTransform = Streams.StringToJsonBufferTransform;
const JsonToObjectTransform = Streams.JsonToObjectTransform;
const BunnyBusPublisher = Streams.BunnyBusPublisher;

let config = null;
const stringToJsonBufferTransform = new StringToJsonBufferTransform();
const jsonToObjectTransform = new JsonToObjectTransform();

Args
    .version(PackageMeta.version)
    .option('-P, --publish', 'publish a message to an exchange')
    .option('-S, --subscribe', 'subscribe message(s) from a queue')
    .option('-c, --config <path>', 'path to the configuration file')
    .option('-v, --verbose', 'streams all processed content')
    .parse(process.argv);

if (Args.config) {
    config = Fs.readFileSync(Helpers.pathBuilder(Args.config));
}

if (!Args.publish && !Args.subscribe && Args.config) {
    process.stdout.write(config);
}

if (Args.publish && Args.subscribe) {
    process.stderr.write('ERROR: Publish and Subscribe can not be used in conjunction');
}

if (Args.publish) {

    const bunnyBusPublisher = new BunnyBusPublisher({ bunnyBus : config });

    const pipe = process.stdin
        .pipe(stringToJsonBufferTransform)
        .pipe(jsonToObjectTransform)
        .pipe(bunnyBusPublisher);
}
