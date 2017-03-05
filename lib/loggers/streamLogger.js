'use strict';

class StreamLogger {

    constructor(stream) {

        this._stream = stream;
    }

    debug(message) {

        this._write('DEBUG', message);
    }

    info(message) {

        this._write('INFO', message);
    }

    warn(message) {

        this._write('WARN', message);
    }

    error(message) {

        this._write('ERROR', message);
    }

    fatal(message) {

        this._write('FATAL', message);
    }

    _write(level, message) {

        this._stream.write(`${new Date()} [${level}] ${message}`);
    }
}

module.exports = StreamLogger;
