'use strict';

class OperationError extends Error {

    constructor(operation) {

        super(`error while executing operation [${operation}]`);
        this.name = 'OperationError';
    }
}

module.exports = OperationError;
