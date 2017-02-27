'use strict';

const Lab = require('lab');
const Code = require('code');
const Shell = require('shelljs');

const lab = exports.lab = Lab.script();
const before = lab.before;
const after = lab.after;
const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('bunnybus', () => {

    before((done) => {

        Shell.config.silent = true;
        done();
    });

    describe.only('config', () => {

        it('should load config when provided ./test/mocks/configuration.json', (done) => {

            const result = Shell.exec('bunnybus -c ./test/mocks/configuration.json');

            expect(JSON.parse(result.stdout)).to.be.equal(require('./mocks/configuration.json'));
            done();
        });

        it('should load config when provided test/mocks/configuration.json', (done) => {

            const result = Shell.exec('bunnybus -c test/mocks/configuration.json');

            expect(JSON.parse(result.stdout)).to.be.equal(require('./mocks/configuration.json'));
            done();
        });

        it('should load config when provided $PWD/test/mocks/configuration.json', (done) => {

            const result = Shell.exec('bunnybus -c $PWD/test/mocks/configuration.json');

            expect(JSON.parse(result.stdout)).to.be.equal(require('./mocks/configuration.json'));
            done();
        });
    });
});