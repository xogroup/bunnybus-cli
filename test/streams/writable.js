'use strict';

const Lab = require('lab');
const Code = require('code');
const Async = require('async');
const BunnyBus = require('bunnybus');
const Exceptions = require('../../lib/exceptions');
const Streams = require('../../lib/streams');
const ObjectReader = Streams.ObjectReader;
const BunnyBusPublisher = Streams.BunnyBusPublisher;

const lab = exports.lab = Lab.script();
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

let bunnyBus = undefined;

describe('Writable Streams', () => {

    const BareMessage = require('../mocks/bareMessage.json');

    before((done) => {

        bunnyBus = new BunnyBus();
        done();
    });

    describe('BunnyBusPublisher', () => {

        const queueName = 'bunnybus-cli-bunnybus-publisher';

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

            it('should write publish a message to a subscribing queue', (done) => {

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
        });
    });
});