'use strict';

const Lab = require('lab');
const Code = require('code');
const StringReader = require('../../lib/streams').StringReader;

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Readable Streams', () => {

    describe('StringReader', () => {

        it('should return a entire buffer', (done) => {

            const data = 'abcdefghijklmnopqrstuvwxyz';
            const stringReader = new StringReader(data);

            stringReader.on('data', (chunk) => {

                expect(chunk).to.be.equal(data);
                done();
            });
        });
    });
});