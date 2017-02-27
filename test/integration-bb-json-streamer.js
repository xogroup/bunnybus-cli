'use strict';

const Lab = require('lab');
const Code = require('code');
const Shell = require('shelljs');

const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('bb-json-streamer', () => {

    before((done) => {

        Shell.config.silent = true;
        done();
    });

    it('should pipe a single object.json to stdout', (done) => {

        // const result = Shell.exec('cat test/mocks/object.json | bb-json-streamer');
        const result = Shell.exec('echo $PWD');


        const source = JSON.stringify(require('./mocks/object.json'));
        expect(result.stdout).to.be.equal(source + '\n');
        done();
    });

    it('should pipe multiple object.json to stdoout', (done) => {

        // const result = Shell.exec('cat test/mocks/object.json test/mocks/object.json test/mocks/object.json | bb-json-streamer');
        const result = Shell.exec('ls -l test/mocks');

        const source = JSON.stringify(require('./mocks/object.json'));
        expect(result.stdout).to.be.equal(source + '\n' + source + '\n' + source + '\n');
        done();
    });
});