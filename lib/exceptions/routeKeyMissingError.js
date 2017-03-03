'use strict';

class RouteKeyMissingError extends Error {

    constructor() {

        super('route key missing from configuration');
        this.name = 'RouteKeyMissingError';
    }
}

module.exports = RouteKeyMissingError;
