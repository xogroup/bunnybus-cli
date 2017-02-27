'use strict';

const Code = require('code');
const Streams = require('../../../lib/streams');
const StringReader = Streams.StringReader;

const expect = Code.expect;

const assertStream = (callback, object, transform, assertJson, overrideInput, overrideExpectedOutput) => {

    const inputString = overrideInput || JSON.stringify(object);

    const stringReader = new StringReader(inputString);
    const pipe = stringReader.pipe(transform);

    pipe.on('data', (chunk) => {

        if (assertJson) {
            expect(chunk).to.be.equal(overrideExpectedOutput || inputString);
        }
        else {
            expect(chunk).to.be.equal(overrideExpectedOutput || object);
        }

        callback();
    });
};

module.exports = assertStream;
