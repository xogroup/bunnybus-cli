'use strict';

const Code = require('code');
const Async = require('async');
const Streams = require('../../lib/streams');
const ObjectCountRecorder = Streams.ObjectCountRecorder;
const BunnyBusSubscriber = Streams.BunnyBusSubscriber;

const expect = Code.expect;

const ConfigurationFile = require('../mocks/configuration.json');
const BareMessage = require('../mocks/bareMessage.json');

const assertStreamSubscriber = (bunnyBus, iterations, queueName, metaData, callback, durationMs = 1700) => {

    const config = Object.assign({}, ConfigurationFile);
    config.queue.name = queueName;
    const bunnyBusSubscriber = new BunnyBusSubscriber({ bunnyBus : config , durationMs, metaData });
    const objectCountRecorder = new ObjectCountRecorder();

    Async.timesLimit(
        iterations,
        50,
        (n, cb) => bunnyBus.send(BareMessage, queueName, cb),
        () => {

            bunnyBusSubscriber.pipe(objectCountRecorder);

            bunnyBusSubscriber.once('close', () => {

                expect(objectCountRecorder.count).to.equal(iterations);
                const result = JSON.parse(objectCountRecorder.currentObject);

                if (metaData) {
                    expect(result.message).to.be.equal(BareMessage);
                    expect(result.metaData).to.exist();
                    expect(result.process).to.exist();
                }
                else {
                    expect(result).to.be.equal(BareMessage);
                }

                callback();
            });
        });
};

module.exports = assertStreamSubscriber;
