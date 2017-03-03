'use strict';

class QueueConfigMissingError extends Error {

    constructor() {

        super('queue config missing from configuration');
        this.name = 'QueueConfigMissingError';
    }
}

module.exports = QueueConfigMissingError;
