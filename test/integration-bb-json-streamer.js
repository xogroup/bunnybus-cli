'use strict';

const Lab = require('lab');
const Code = require('code');
const Exec = require('child_process').exec;

const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('bb-json-streamer', () => {

    const sourceObject = JSON.stringify(require('./mocks/object.json'));

    before((done) => {

        done();
    });

    it('should pipe a single object.json to stdout', (done) => {

        Exec('cat ./test/mocks/object.json | bb-json-streamer', (err, stdout) => {

            expect(err).to.be.null();
            expect(stdout).to.be.equal(sourceObject + '\n');
            done();
        });
    });

    it('should pipe multiple object.json to stdoout', (done) => {

        Exec('cat test/mocks/object.json test/mocks/object.json test/mocks/object.json | bb-json-streamer', (err, stdout) => {

            expect(err).to.be.null();
            expect(stdout).to.be.equal(sourceObject + '\n' + sourceObject + '\n' + sourceObject + '\n');
            done();
        });
    });
});