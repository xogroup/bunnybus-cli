'use strict';

const Lab = require('lab');
const Code = require('code');
const Fs = require('fs');
const Exec = require('child_process').exec;
const Assertions = require('./assertions');
const Async = require('async');
const BunnyBus = require('bunnybus');

const lab = exports.lab = Lab.script();
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

let bunnyBus = undefined;

describe('bunnybus', () => {

    const ConfigurationFile = require('./mocks/configuration.json');
    const BareMessage = require('./mocks/bareMessage.json');

    before((done) => {

        bunnyBus = new BunnyBus();
        done();
    });

    describe('-c', () => {

        it('should stdout config when prepended "./"', (done) => {

            Assertions.assertCliConfig('./', true, done);
        });

        it('should stdout config when nothing is prepended', (done) => {

            Assertions.assertCliConfig('', true, done);
        });

        it('should stdout config when prepended "$PWD/"', (done) => {

            Assertions.assertCliConfig('$PWD/', true, done);
        });

        it('should stderr when no path is provided with config flag', (done) => {

            Assertions.assertCliConfig(null, false, done);
        });
    });

    describe('-c -v', () => {

        const logFilePath = '/tmp/bunnybus-cli-logs.json';
        const configurationPath = 'test/mocks/configuration.json';

        beforeEach((done) => {

            if (Fs.existsSync(logFilePath)) {
                Fs.unlink(logFilePath, done);
            }
            else {
                done();
            }
        });

        it('should write configs to a log file', (done) => {

            Exec(`bunnybus -c ${configurationPath} -v ${logFilePath}`, () => {

                expect(Fs.existsSync(logFilePath)).to.be.true();
                done();
            });
        });
    });

    describe('-P -c', () => {

        const queueName = 'bunnybus-cli-bunnybus-publisher';

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

        it('should publish a 1 object', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 1, false, done);
        });

        it('should publish a 35 objects', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 51, false, done);
        });

        it('should publish a 51 objects', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 51, false, done);
        });

        it('should publish a 60 objects', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 60, false, done);
        });

        it('should publish a 75 objects', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 75, false, done);
        });

        it('should publish a 100 objects', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 100, false, done);
        });
    });

    describe('-P -c -t', () => {

        const queueName = 'bunnybus-cli-bunnybus-publisher';

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

        it('should publish 1 object', (done) => {

            Assertions.assertCliPublisher(bunnyBus, queueName, 1, true, done);
        });
    });

    describe('-S -c -d', () => {

        const queueName = ConfigurationFile.queue.name;

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

        it('should subscribe 1 object', (done) => {

            Assertions.assertCliSubscriber(bunnyBus, queueName, 1, done, 200);
        });

        it('should subscribe 100 object', (done) => {

            Assertions.assertCliSubscriber(bunnyBus, queueName, 100, done, 400);
        });

        it('should subscribe 500 object', (done) => {

            Assertions.assertCliSubscriber(bunnyBus, queueName, 500, done, 800);
        });
    });

    describe('-G -c', () => {

        const queueName = ConfigurationFile.queue.name;

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

        it('should subscribe 1 object', (done) => {

            Assertions.assertCliGet(bunnyBus, queueName, 1, done);
        });

        it('should subscribe 100 object', (done) => {

            Assertions.assertCliGet(bunnyBus, queueName, 100, done);
        });

        it('should subscribe 500 object', { timeout : 4000 }, (done) => {

            Assertions.assertCliGet(bunnyBus, queueName, 500, done);
        });
    });
});
