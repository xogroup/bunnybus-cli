'use strict';

const Code = require('code');
const Async = require('async');
const Streams = require('../../lib/streams');
const ObjectCountRecorder = Streams.ObjectCountRecorder;
const BunnyBusGet = Streams.BunnyBusGet;

const expect = Code.expect;

const ConfigurationFile = require('../mocks/configuration.json');
const BareMessage = require('../mocks/bareMessage.json');

const assertStreamGet = (bunnyBus, iterations, queueName, callback) => {

    const config = Object.assign({}, ConfigurationFile);
    config.queue.name = queueName;
    const bunnyBusGet = new BunnyBusGet({ bunnyBus : config });
    const objectCounterRecorder = new ObjectCountRecorder();

    Async.timesLimit(
        iterations,
        50,
        (n, cb) => bunnyBus.send(BareMessage, queueName, cb),
        () => {

            bunnyBusGet.pipe(objectCounterRecorder);

            bunnyBusGet.once('close', () => {

                expect(objectCounterRecorder.count).to.equal(iterations);
                callback();
            });
        });
};

module.exports = assertStreamGet;
