#!/usr/bin/env node
'use strict';

const Fs = require('fs');
const Args = require('commander');
const Helpers = require('../helpers');
const Streams = require('../streams');
const Loggers = require('../loggers');
const PackageMeta = require('../../package.json');
const StringToJsonBufferTransform = Streams.StringToJsonBufferTransform;
const JsonToObjectTransform = Streams.JsonToObjectTransform;
const BunnyBusPublisher = Streams.BunnyBusPublisher;
const BunnyBusSubscriber = Streams.BunnyBusSubscriber;
const BunnyBusGet = Streams.BunnyBusGet;
const NewLineTransform = Streams.NewLineTransform;
const StreamLogger = Loggers.StreamLogger;

let config = null;
let logger = null;
const stringToJsonBufferTransform = new StringToJsonBufferTransform();
const jsonToObjectTransform = new JsonToObjectTransform();

Args
    .version(PackageMeta.version)
    .option('-P, --publish', 'publish a message to an exchange')
    .option('-S, --subscribe', 'subscribe message(s) from a queue')
    .option('-G, --get', 'get all message(s) from queue until empty')
    .option('-c, --config <path>', 'path to the configuration file')
    .option('-t, --tee', 'tee to stdout')
    .option('-d, --duration <n>', 'set a runtime duration for subscribe to close within <n> milliseconds. defaults to 0 for infinite', parseInt)
    .option('-m, --metadata', 'generate or consume BunnyBus metadata')
    .option('-v, --verbose <path>', 'output path to a file for logging')
    .parse(process.argv);

logger = new StreamLogger(Args.verbose ? process.stdout : new Streams.NulWriter());

if (Args.verbose) {
    logger.stream = Fs.createWriteStream(Helpers.pathBuilder(Args.verbose));
}

if (Args.config) {
    config = JSON.parse(Fs.readFileSync(Helpers.pathBuilder(Args.config), { encoding : 'utf8' }));
    logger.info(config);
}

if (!Args.publish && !Args.subscribe && !Args.get && Args.config) {
    process.stdout.write(JSON.stringify(config));
}

if (Args.publish && Args.subscribe) {
    process.stderr.write('ERROR: -P and -S can not be used in conjunction');
}

if (Args.publish) {

    const bunnyBusPublisher = new BunnyBusPublisher({ bunnyBus : config, tee : Args.tee, metaData : Args.metadata }, logger);

    process.stdin
        .pipe(stringToJsonBufferTransform)
        .pipe(jsonToObjectTransform)
        .pipe(bunnyBusPublisher);
}

if (Args.subscribe) {

    const bunnyBusSubscriber = new BunnyBusSubscriber({ bunnyBus : config, durationMs : Args.duration, metaData : Args.metadata }, logger);
    const newLineTransform = new NewLineTransform();

    bunnyBusSubscriber
        .pipe(newLineTransform)
        .pipe(process.stdout);
}

if (Args.get) {

    const bunnyBusGet = new BunnyBusGet({ bunnyBus : config, metaData : Args.metadata }, logger);
    const newLineTransform = new NewLineTransform();

    bunnyBusGet
        .pipe(newLineTransform)
        .pipe(process.stdout);
}
