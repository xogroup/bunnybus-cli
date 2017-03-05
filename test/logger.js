'use strict';

const Lab = require('lab');
const Assertions = require('./assertions');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('Loggers', () => {

    describe('StreamLogger', () => {

        it('should log debug to stream', (done) => {

            Assertions.assertStreamLogger('debug', 'debug hello', done);
        });

        it('should log info to stream', (done) => {

            Assertions.assertStreamLogger('info', 'info hello', done);
        });

        it('should log trace to stream', (done) => {

            Assertions.assertStreamLogger('trace', 'trace hello', done);
        });

        it('should log warn to stream', (done) => {

            Assertions.assertStreamLogger('warn', 'warn hello', done);
        });

        it('should log error to stream', (done) => {

            Assertions.assertStreamLogger('error', 'error hello', done);
        });

        it('should log fatal to stream', (done) => {

            Assertions.assertStreamLogger('fatal', 'fatal hello', done);
        });
    });
});
