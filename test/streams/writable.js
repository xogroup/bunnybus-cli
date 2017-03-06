'use strict';

const Lab = require('lab');
const Code = require('code');
const Assertions = require('../assertions');
const Async = require('async');
const BunnyBus = require('bunnybus');
const Streams = require('../../lib/streams');
const ObjectReader = Streams.ObjectReader;
const StringWriter = Streams.StringWriter;
const BunnyBusPublisher = Streams.BunnyBusPublisher;

const lab = exports.lab = Lab.script();
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Writable Streams', () => {

    describe('ObjectCountRecorder', () => {

        it('should return a count of 1', (done) => {

            Assertions.assertObjectCountRecorder(1, done);
        });

        it('should return a count of 99', (done) => {

            Assertions.assertObjectCountRecorder(99, done);
        });
    });

    describe('StringWriter', () => {

        it('should return the input', (done) => {

            const input = 'hello world text';
            const stringWriter = new StringWriter();

            stringWriter.once('data', (chunk) => {

                expect(chunk).to.equal(input);
                done();
            });

            stringWriter.write(input, 'utf8');
        });
    });

    describe('BunnyBusPublisher', () => {

        const BareMessage = require('../mocks/bareMessage.json');
        const queueName = 'bunnybus-cli-bunnybus-publisher-stream';
        let bunnyBus = undefined;

        before((done) => {

            bunnyBus = new BunnyBus();
            done();
        });

        describe('positive test', () => {

            before((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    (cb) => bunnyBus.createExchange(bunnyBus.config.globalExchange, 'topic', cb),
                    (result, cb) => bunnyBus.createQueue(queueName, cb),
                    (result, cb) => bunnyBus.channel.bindQueue(queueName, bunnyBus.config.globalExchange, BareMessage.event, null, cb)
                ], done);
            });

            beforeEach((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    bunnyBus.unsubscribe.bind(bunnyBus, queueName)
                ], done);
            });

            after((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    bunnyBus.deleteExchange.bind(bunnyBus, queueName),
                    bunnyBus.deleteQueue.bind(bunnyBus, queueName)
                ], done);
            });

            it('should publish a message with no metadata to a subscribing queue', (done) => {

                const objectReader = new ObjectReader(BareMessage);
                const bunnyBusPublisher = new BunnyBusPublisher();

                const handlers = {};
                handlers[BareMessage.event] = (message, ack) => {

                    expect(message).to.be.equal(BareMessage);
                    ack();
                };

                bunnyBusPublisher.once('close', done);

                bunnyBus.subscribe(queueName, handlers, () => {

                    objectReader.pipe(bunnyBusPublisher);
                });
            });

            it('should publish a message with metadata to a subscribing queue', (done) => {

                const payload = {
                    message : BareMessage,
                    metaData : {
                        headers : {
                            transactionId : 'abc123xyz',
                            source : 'bunnybus-cli-publish-test'
                        }
                    }
                };

                const objectReader = new ObjectReader(payload);
                const bunnyBusPublisher = new BunnyBusPublisher({ metaData : true });

                const handlers = {};
                handlers[BareMessage.event] = (message, metaData, ack) => {

                    expect(message).to.be.equal(BareMessage);
                    expect(metaData).to.exist();
                    expect(metaData.headers.transactionId).to.be.equal(payload.metaData.headers.transactionId);
                    expect(metaData.headers.source).to.be.equal(payload.metaData.headers.source);
                    ack();
                };

                bunnyBusPublisher.once('close', done);

                bunnyBus.subscribe(queueName, handlers, { meta : true }, () => {

                    objectReader.pipe(bunnyBusPublisher);
                });
            });
        });
    });
});
