'use strict';

const Code = require('code');
const Async = require('async');
const Streams = require('../../lib/streams');
const ObjectCountRecorder = Streams.ObjectCountRecorder;
const BunnyBusGet = Streams.BunnyBusGet;

const expect = Code.expect;

const ConfigurationFile = require('../mocks/configuration.json');
const BareMessage = require('../mocks/bareMessage.json');

const assertStreamGet = (bunnyBus, iterations, queueName, metaData, callback) => {

    const config = Object.assign({}, ConfigurationFile);
    config.queue.name = queueName;
    const bunnyBusGet = new BunnyBusGet({ bunnyBus : config, metaData });
    const objectCountRecorder = new ObjectCountRecorder();

    Async.timesLimit(
        iterations,
        20,
        (n, cb) => bunnyBus.send(BareMessage, queueName, cb),
        () => {

            bunnyBusGet.pipe(objectCountRecorder);

            bunnyBusGet.once('close', () => {

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

module.exports = assertStreamGet;
