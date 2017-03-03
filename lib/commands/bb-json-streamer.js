#!/usr/bin/env node
'use strict';

const Streams = require('../streams');
const StringToJsonBufferTransform = Streams.StringToJsonBufferTransform;
const NewLineTransform = Streams.NewLineTransform;

process.stdin
    .pipe(new StringToJsonBufferTransform())
    .pipe(new NewLineTransform())
    .pipe(process.stdout);
