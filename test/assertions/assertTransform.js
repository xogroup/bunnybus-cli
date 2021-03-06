'use strict';

const Code = require('code');
const Streams = require('../../lib/streams');
const StringReader = Streams.StringReader;

const expect = Code.expect;

const assertTransform = (callback, object, transform, assertJson, overrideInput, overrideExpectedOutput, assertException) => {

    const inputString = overrideInput || JSON.stringify(object);

    const stringReader = new StringReader(inputString);
    const pipe = stringReader.pipe(transform);

    pipe.once('data', (chunk) => {

        if (assertJson) {
            expect(chunk).to.be.equal(overrideExpectedOutput || inputString);
        }
        else {
            expect(chunk).to.be.equal(overrideExpectedOutput || object);
        }

        callback();
    });

    if (assertException) {
        transform.once('error', (err) => {

            expect(err).to.be.an.error(assertException);
            callback();
        });
    }
};

module.exports = assertTransform;
