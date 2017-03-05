'use strict';

const Code = require('code');
const Exec = require('child_process').exec;

const expect = Code.expect;

const BareMessage = require('../mocks/bareMessage.json');
const configurationPath = 'test/mocks/configuration.json';
const bareMessagePath = 'test/mocks/bareMessage.json';

const assertCliPublish = (bunnyBus, queueName, iterations, isTee, callback) => {

    const handlers = {};
    let fileList = '';
    let counter = 0;
    let finishCounter = 0;

    const finish = () => {

        if (++finishCounter === 2) {
            callback();
        }
    };

    handlers[BareMessage.event] = (message, ack) => {

        expect(message).to.be.equal(BareMessage);
        ack();

        if (++counter === iterations) {
            finish();
        }
    };

    for (let i = 0; i < iterations; ++i) {
        fileList += bareMessagePath + ' ';
    }

    bunnyBus.subscribe(queueName, handlers, () => {

        Exec(`cat ${fileList} | bunnybus -P ${isTee ? '-t' : ''} -c ${configurationPath}`, (err, stdout) => {

            if (isTee) {
                expect(err).to.be.null();
                expect(stdout.length).to.be.above(0);
            }

            finish();
        });
    });
};

module.exports = assertCliPublish;
