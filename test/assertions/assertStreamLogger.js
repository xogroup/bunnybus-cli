'use strict';

const Code = require('code');

const expect = Code.expect;

const StreamLogger = require('../../lib/loggers').StreamLogger;
const Streams = require('../../lib/streams');
const StringWriter = Streams.StringWriter;

const assertStreamsLogger = (level, input, callback) => {

    const stringWriter = new StringWriter();
    const logger = new StreamLogger(stringWriter);

    stringWriter.once('data', (chunk) =>  {

        expect(chunk).to.include(input);
        callback();
    });

    logger.debug(input);
};

module.exports = assertStreamsLogger;
