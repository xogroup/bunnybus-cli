'use strict';

const Code = require('code');
const Streams = require('../../lib/streams');
const ObjectReader = Streams.ObjectReader;

const expect = Code.expect;
const data = { event : 'systemA.message-created', body : 'some text we want to send' };

const assertStreamObjectReader = (iterations, callback) => {

    let counter = 0;

    const objectReader = new ObjectReader(data, { repeat : iterations });

    objectReader.on('data', (chunk) => {

        expect(chunk).to.be.equal(data);

        if (++counter === iterations) {
            callback();
        }
    });
};

module.exports = assertStreamObjectReader;
