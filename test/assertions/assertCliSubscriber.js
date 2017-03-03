'use strict';

const Code = require('code');
const Exec = require('child_process').exec;
const Async = require('async');

const expect = Code.expect;

const BareMessage = require('../mocks/bareMessage.json');
const configurationPath = 'test/mocks/configuration.json';

const assertCliSubscriber = (bunnyBus, queueName, iterations, callback, duration = 1700) => {

    Async.timesLimit(
        iterations,
        50,
        (n, cb) => bunnyBus.send(BareMessage, queueName, cb),
        () => {

            // wc - counts the lines of output
            // xargs - strips out the number only
            // tr - removes unwanted character
            // Exec(`bunnyBus -S -c ${configurationPath} -d ${duration} | wc -l | xargs | tr -d "\n"`, (err, stdout) => {
                Exec(`bunnyBus -S -c ${configurationPath} -d ${duration}`, (err, stdout) => {
                console.log(stdout);
                expect(err).to.be.null();
                // expect(stdout).to.be.equal(iterations.toString());
                callback();
            });
        }
    );
};

module.exports = assertCliSubscriber;
