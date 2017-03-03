'use strict';

const Code = require('code');
const Async = require('async');
const Streams = require('../../lib/streams');
const ObjectCountRecorder = Streams.ObjectCountRecorder;
const BunnyBusSubscriber = Streams.BunnyBusSubscriber;

const expect = Code.expect;

const ConfigurationFile = require('../mocks/configuration.json');
const BareMessage = require('../mocks/bareMessage.json');

const assertStreamSubscribe = (bunnyBus, iterations, queueName, callback, durationMs = 1700) => {

    const config = Object.assign({}, ConfigurationFile);
    config.queue.name = queueName;
    const bunnyBusSubscriber = new BunnyBusSubscriber({ bunnyBus : config , durationMs });
    const objectCounterRecorder = new ObjectCountRecorder();

    Async.timesLimit(
        iterations,
        50,
        (n, cb) => bunnyBus.send(BareMessage, queueName, cb),
        () => {

            bunnyBusSubscriber.pipe(objectCounterRecorder);

            bunnyBusSubscriber.once('close', () => {

                expect(objectCounterRecorder.count).to.equal(iterations);
                callback();
            });
        });
};

module.exports = assertStreamSubscribe;
