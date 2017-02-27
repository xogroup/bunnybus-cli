'use strict';

class JsonStringFormatError extends Error {

    constructor(positionCount, char) {

        super(`format issue found at position ${positionCount} with character ${char}`);
        this.name = 'JsonStringFormatError';
    }
}

module.exports = JsonStringFormatError;