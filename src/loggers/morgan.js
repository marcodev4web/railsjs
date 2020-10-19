/**
 * Logs requests
 * @module src/loggers/morgan
 */

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

let logger = morgan('dev');

if (process.env.APP_ENV === 'production') {
    let logStream = fs.createWriteStream(path.join(__dirname, '../logs/requests.log'), {flags: 'a'});

    logger = morgan('common', {stream: logStream});
}

module.exports = logger;