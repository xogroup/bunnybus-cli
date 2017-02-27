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

describe('stream', () => {

    it('should pipe echo command', (done) => {
        // Shell.exec('cat package.json | bunnybus');
        // Shell.exec('echo "{ \"hello\" : \"world\" }" | bunnybus');
        //Shell.exec('cat test-file.json | bunnybus');
        Shell.exec('cat test/mocks/object.json | bb-json-streamer');
        done();
    });
});