'use strict';

const Lab = require('lab');
const Code = require('code');
const Streams = require('../../lib/streams');
const StringReader = Streams.StringReader;
const ObjectReader = Streams.ObjectReader;

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Readable Streams', () => {

    describe('StringReader', () => {

        it('should return an entire buffer', (done) => {

            const data = 'abcdefghijklmnopqrstuvwxyz';
            const stringReader = new StringReader(data);

            stringReader.once('data', (chunk) => {

                expect(chunk).to.be.equal(data);
                done();
            });
        });
    });

    describe('ObjectReader', () => {

        it('should return an object buffer', (done) => {

            const data = { event : 'systemA.message-created', body : 'some text we want to send' };

            const objectReader = new ObjectReader(data);

            objectReader.once('data', (chunk) => {

                expect(chunk).to.be.equal(data);
                done();
            });
        });

        it('should return an object buffer 3 times', (done) => {

            const data = { event : 'systemA.message-created', body : 'some text we want to send' };
            const iterations = 3;
            let counter = 0;

            const objectReader = new ObjectReader(data, { repeat : iterations });


            objectReader.on('data', (chunk) => {

                expect(chunk).to.be.equal(data);

                if (++counter === iterations) {
                    done();
                }
            });
        });
    });
});