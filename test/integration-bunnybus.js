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

    const configurationPath = 'test/mocks/configuration.json';
    const bareMessagePath = 'test/mocks/bareMessage.json';
    const ConfigurationFile = require('./mocks/configuration.json');

    before((done) => {

        Shell.config.silent = true;
        done();
    });

    describe('config', () => {

        it(`should stdout config when provided ./${configurationPath}`, (done) => {

            const result = Shell.exec(`bunnybus -c ./${configurationPath}`);

            expect(JSON.parse(result.stdout)).to.be.equal(ConfigurationFile);
            done();
        });

        it(`should stdout config when provided ${configurationPath}`, (done) => {

            const result = Shell.exec(`bunnybus -c ${configurationPath}`);

            expect(JSON.parse(result.stdout)).to.be.equal(ConfigurationFile);
            done();
        });

        it(`should stdout config when provided $PWD/${configurationPath}`, (done) => {

            const result = Shell.exec(`bunnybus -c $PWD/${configurationPath}`);

            expect(JSON.parse(result.stdout)).to.be.equal(ConfigurationFile);
            done();
        });

        it('should stderr when no path is provided with config flag', (done) => {

            const result = Shell.exec('bunnybus -c');

            expect(result.stderr.length).to.be.above(0);
            done();
        });
    });

    describe('publish', () => {

        it('should publish when object is sent', (done) => {

            const result = Shell.exec(`cat ${bareMessagePath} | bunnybus -P -c ${configurationPath}`);
            console.dir(result);

            done();
        });
    });
});