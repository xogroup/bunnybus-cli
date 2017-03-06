'use strict';

const PackageMeta = require('../../package.json');

const processInfo = (source) => {

    return {
        name : PackageMeta.name,
        version : PackageMeta.version,
        timestamp : new Date(),
        source
    };
};

module.exports = processInfo;
