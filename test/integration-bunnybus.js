'use strict';

const Lab = require('lab');
const Code = require('code');
const Async = require('async');
const BunnyBus = require('bunnybus');
const Exec = require('child_process').exec;

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

    const configurationPath = 'test/mocks/configuration.json';
    const bareMessagePath = 'test/mocks/bareMessage.json';
    const ConfigurationFile = require('./mocks/configuration.json');
    const BareMessage = require('./mocks/bareMessage.json');

    before((done) => {

        bunnyBus = new BunnyBus();
        done();
    });

    describe('config', () => {

        it(`should stdout config when provided ./${configurationPath}`, (done) => {

            Exec(`bunnybus -c ./${configurationPath}`, (err, stdout) => {

                expect(err).to.be.null();
                expect(JSON.parse(stdout)).to.be.equal(ConfigurationFile);
                done();
            });
        });

        it(`should stdout config when provided ${configurationPath}`, (done) => {

            Exec(`bunnybus -c ${configurationPath}`, (err, stdout) => {

                expect(err).to.be.null();
                expect(JSON.parse(stdout)).to.be.equal(ConfigurationFile);
                done();
            });
        });

        it(`should stdout config when provided $PWD/${configurationPath}`, (done) => {


            Exec(`bunnybus -c $PWD/${configurationPath}`, (err, stdout) => {

                expect(err).to.be.null();
                expect(JSON.parse(stdout)).to.be.equal(ConfigurationFile);
                done();
            });
        });

        it('should stderr when no path is provided with config flag', (done) => {

            Exec('bunnybus -c', (err, stdout, stderr) => {

                expect(err).to.exist();
                expect(stderr.length).to.be.above(0);
                done();
            });
        });
    });

    describe('publish', () => {

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

        it('should publish when object is sent', { timeout : 5000 }, (done) => {

            const handlers = {};
            handlers[BareMessage.event] = (message, ack) => {
                expect(message).to.be.equal(BareMessage);
                ack(done);
            };

            bunnyBus.subscribe(queueName, handlers, () => {

                Exec(`cat ${bareMessagePath} | bunnybus -P -c ${configurationPath}`);
            });
        });
    });
});