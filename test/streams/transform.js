'use strict';

const Lab = require('lab');
const Code = require('code');
const Assertions = require('./assertions');
const Exceptions = require('../../lib/exceptions');
const Streams = require('../../lib/streams');
const StringReader = Streams.StringReader;
const JsonToObjectTransform = Streams.JsonToObjectTransform;
const StringToJsonBufferTransform = Streams.StringToJsonBufferTransform;
const NewLineTransform = Streams.NewLineTransform;

const lab = exports.lab = Lab.script();
const before = lab.before;
const after = lab.after;
const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const it_object = (name, object, options, callback) => {

    if (typeof options === 'function') {
        callback = options;
    }

    it(`${name} ${JSON.stringify(object)}`, options, callback.bind(object));
}

describe('Transform Streams', () => {

    describe('JsonToObjectTransform', () => {

        describe('positive test', () => {

            it_object('should return an object when given', { a : 'value1' }, function (done) {

                Assertions.assertStream(done, this, new JsonToObjectTransform());
            });

            it_object('should return an object when given', { a : 'value1' }, function (done) {

                Assertions.assertStream(done, this, new JsonToObjectTransform());
            });

            it_object('should return an object when given', { '\u4e0a\u6d77' : 'value1' }, function (done) {

                Assertions.assertStream(done, this, new JsonToObjectTransform());
            });

            it_object('should return an object when given', [{ a : 'value1' }, { b : 'value2' }], function (done) {

                Assertions.assertStream(done, this, new JsonToObjectTransform());
            });
        });
    });

    describe('StringToJsonBufferTransform', () => {

        describe('positive test', () => {

            it_object('should return a json string when given', { a : 'value' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return a json string when given', { 'a.b' : 'value' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', [{ a : 'value1' }, { b : 'value2' }], function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'value1', b : { c : 'value2' } }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : '\'value' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'value\'' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : '"value' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'value"' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : '"value"' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : '{value' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'value}' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'value 1 value 2' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : 'abæáÖÇÆÿģŒⓈ✟yz' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { 'abæáÖÇÆÿģŒⓈ✟yz' : 'value1' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { a : '\u4e0a\u6d77' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it_object('should return json string when given', { '\u4e0a\u6d77' : 'value1' }, function (done) {

                Assertions.assertStream(done, this, new StringToJsonBufferTransform(), true);
            });

            it('should return json string when given { \\n\\t"a" : "value1", \\t\\n "b" : "value2" \\n }', (done) => {

                Assertions.assertStream(done, null, new StringToJsonBufferTransform(), true, '{ \n\t"a" : "value1", \t\n "b" : "value2" \n }\n', '{"a":"value1","b":"value2"}');
            });
        });

        describe('negative test', () => {

            it('should return json string when given { "a" : "value1" } {', (done) => {

                Assertions.assertStream(done, null, new StringToJsonBufferTransform(), true, '{ "a" : "value1" } {', '{"a":"value1"}');
            });

            it('should return json string when given } { "a" : "value1" } {', (done) => {

                Assertions.assertStream(done, null, new StringToJsonBufferTransform(), true, '} { "a" : "value1" } {', '{"a":"value1"}');
            });

            it('should return json string when given { "a" : "value1" } }', (done) => {

                Assertions.assertStream(done, null, new StringToJsonBufferTransform(), true, '{ "a" : "value1" } {', '{"a":"value1"}');
            });

            it('should throw JsonStringFormatError when given { { "a" : "value1" }', (done) => {

                Assertions.assertStream(done, null, new StringToJsonBufferTransform(), null, '{ { "a" : "value1" }', null, Exceptions.JsonStringFormatError);
            });
        });
    });

    describe('NewlineTransform', () => {

        describe('positive test', () => {

            it('should return a string with newline character', (done) => {

                const string = 'test 1 2 3';
                const stringReader = new StringReader(string);
                const newLineTransform = new NewLineTransform();

                const pipe = stringReader.pipe(newLineTransform);

                pipe.on('data', (chunk) => {

                    expect(chunk).to.be.equal(string + '\n');
                    done();
                });
            });
        });
    });
});