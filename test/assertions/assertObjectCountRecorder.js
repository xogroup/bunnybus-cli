'use strict';

const Code = require('code');

const expect = Code.expect;

const Streams = require('../../lib/streams');
const ObjectReader = Streams.ObjectReader;
const ObjectCountRecorder = Streams.ObjectCountRecorder;

const assertObjectCountRecorder = (iterations, callback) => {

    const objectReader = new ObjectReader({ prop1 : 'value1' }, { repeat : iterations });
    const objectCountRecorder = new ObjectCountRecorder();

    const pipe = objectReader.pipe(objectCountRecorder);

    pipe.once('finish', () => {

        expect(objectCountRecorder.count).to.be.equal(iterations);
        callback();
    });
};

module.exports = assertObjectCountRecorder;
