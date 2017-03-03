'use strict';

const Code = require('code');
const Exec = require('child_process').exec;

const expect = Code.expect;

const BareMessage = require('../mocks/bareMessage.json');
const configurationPath = 'test/mocks/configuration.json';
const bareMessagePath = 'test/mocks/bareMessage.json';

const assertCliPublish = (bunnyBus, queueName, iterations, callback) => {

    const handlers = {};
    let fileList = '';
    let counter = 0;

    handlers[BareMessage.event] = (message, ack) => {

        expect(message).to.be.equal(BareMessage);
        ack();

        if (++counter === iterations) {
            callback();
        }
    };

    for (let i = 0; i < iterations; ++i) {
        fileList += bareMessagePath + ' ';
    }

    bunnyBus.subscribe(queueName, handlers, () => {

        Exec(`cat ${fileList} | bunnybus -P -c ${configurationPath}`);
    });
};

module.exports = assertCliPublish;
