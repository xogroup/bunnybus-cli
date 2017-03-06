'use strict';

const Lab = require('lab');
const Code = require('code');
const Assertions = require('../assertions');
const Async = require('async');
const BunnyBus = require('bunnybus');
const Streams = require('../../lib/streams');
const StringReader = Streams.StringReader;

const lab = exports.lab = Lab.script();
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Readable Streams', () => {

    let bunnyBus = undefined;

    before((done) => {

        process.setMaxListeners(50);
        bunnyBus = new BunnyBus();
        done();
    });

    describe('StringReader', () => {

        it('should return an entire buffer', (done) => {

            const data = 'abcdefghijklmnopqrstuvwxyz';
            const stringReader = new StringReader(data);

            stringReader.once('data', (chunk) => {

                expect(chunk).to.be.equal(data);
                done();
            });
        });
    });

    describe('ObjectReader', () => {

        it('should return an 1 object buffer', (done) => {

            Assertions.assertStreamObjectReader(1, done);
        });

        it('should return an 100 object buffer', (done) => {

            Assertions.assertStreamObjectReader(100, done);
        });

        it('should return an 1000 object buffer', (done) => {

            Assertions.assertStreamObjectReader(1000, done);
        });
    });

    describe('BunnyBusSubscriber', () => {

        const queueName = 'bunnybus-cli-bunnybus-subscriber-stream';

        describe('positive test', () => {

            beforeEach((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    (cb) => bunnyBus.createExchange(bunnyBus.config.globalExchange, 'topic', cb),
                    (result, cb) => bunnyBus.createQueue(queueName, cb)
                ], done);
            });

            afterEach((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    bunnyBus.deleteExchange.bind(bunnyBus, queueName),
                    bunnyBus.deleteQueue.bind(bunnyBus, queueName)
                ], done);
            });

            it('should subscribe 1 message with no metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 1, queueName, false, done, 100);
            });

            it('should subscribe 100 message with no metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 100, queueName, false, done, 400);
            });

            it('should subscribe 500 message with no metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 500, queueName, false, done, 800);
            });

            it('should subscribe 1 message with metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 1, queueName, true, done, 100);
            });

            it('should subscribe 100 message with metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 100, queueName, true, done, 400);
            });

            it('should subscribe 500 message with metadata from a queue', (done) => {

                Assertions.assertStreamSubscriber(bunnyBus, 500, queueName, true, done, 800);
            });
        });
    });

    describe('BunnyBusGet', () => {

        const queueName = 'bunnybus-cli-bunnybus-get-stream';

        describe('positive test', () => {

            beforeEach((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    (cb) => bunnyBus.createExchange(bunnyBus.config.globalExchange, 'topic', cb),
                    (result, cb) => bunnyBus.createQueue(queueName, cb)
                ], done);
            });

            afterEach((done) => {

                Async.waterfall([
                    bunnyBus._autoConnectChannel,
                    bunnyBus.deleteExchange.bind(bunnyBus, queueName),
                    bunnyBus.deleteQueue.bind(bunnyBus, queueName)
                ], done);
            });

            it('should subscribe 1 message with no metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 1, queueName, false, done);
            });

            it('should subscribe 100 message with no metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 100, queueName, false, done);
            });

            it('should subscribe 500 message with no metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 500, queueName, false, done);
            });

            it('should subscribe 1 message with metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 1, queueName, true, done);
            });

            it('should subscribe 100 message with metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 100, queueName, true, done);
            });

            it('should subscribe 500 message with metadata from a queue', (done) => {

                Assertions.assertStreamGet(bunnyBus, 500, queueName, true, done);
            });
        });
    });
});
