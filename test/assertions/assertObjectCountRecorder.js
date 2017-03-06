'use strict';

const Code = require('code');

const expect = Code.expect;

const Streams = require('../../lib/streams');
const ObjectReader = Streams.ObjectReader;
const ObjectCountRecorder = Streams.ObjectCountRecorder;

const assertObjectCountRecorder = (iterations, callback) => {

    const input = { prop1 : 'value1' };
    const objectReader = new ObjectReader(input, { repeat : iterations });
    const objectCountRecorder = new ObjectCountRecorder();

    const pipe = objectReader.pipe(objectCountRecorder);

    pipe.once('finish', () => {

        expect(objectCountRecorder.count).to.be.equal(iterations);
        expect(objectCountRecorder.currentObject).to.be.equal(input);
        callback();
    });
};

module.exports = assertObjectCountRecorder;
