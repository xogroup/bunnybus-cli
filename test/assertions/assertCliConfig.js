'use strict';

const Code = require('code');
const Exec = require('child_process').exec;

const expect = Code.expect;

const ConfigurationFile = require('../mocks/configuration.json');
const configurationPath = 'test/mocks/configuration.json';

const assertCliConfig = (prependText, appendConfig, callback) => {

    const command = appendConfig
        ? `bunnybus -c ${prependText ? prependText : ''}${configurationPath}`
        : 'bunnybus -c';

    Exec(command, (err, stdout, stderr) => {

        if (appendConfig) {
            expect(err).to.be.null();
            expect(JSON.parse(stdout)).to.be.equal(ConfigurationFile);
        }
        else {
            expect(err).to.exist();
            expect(stderr.length).to.be.above(0);
        }

        callback();
    });
};

module.exports = assertCliConfig;
