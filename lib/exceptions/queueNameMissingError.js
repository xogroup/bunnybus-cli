'use strict';

class QueueNameMissingError extends Error {

    constructor() {

        super('queue name missing from configuration');
        this.name = 'QueueNameMissingError';
    }
}

module.exports = QueueNameMissingError;
