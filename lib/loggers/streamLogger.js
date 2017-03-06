'use strict';

const NulWriter = require('../streams/nulWriter');

class StreamLogger {

    constructor(stream = new NulWriter()) {

        this._initialized = false;
        this.stream = stream;
    }

    set stream(value) {

        this._initialized = false;
        this._stream = value;

        value.on('open', () => {

            this._initialized = true;
        });
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

        const tryPush = (l, m) => {

            const serializedMessage = typeof m !== 'string' ? JSON.stringify(m) : m;
            this._stream.write(`${new Date()} [${l}] ${serializedMessage}`);
        };

        const retry = (l,m) => {

            const ref = setInterval(() => {

                if (this._initialized) {

                    tryPush(l,m);
                    clearInterval(ref);
                }
            }, 1);
        };

        if (this._initialized) {
            tryPush(level, message);
        }
        else {
            retry(level, message);
        }
    }
}

module.exports = StreamLogger;
