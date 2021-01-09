/**
 * Express Web Server
 * @module src/server
 */

// Config environment variables
require('dotenv').config();

// Include libs
const express = require('express');
const app = express();
const logger = require('./loggers/morgan');

// Config Server
app.use(logger);
app.use(express.static('./src/public'));
app.use(express.json());
app.use('/api', require('./routes/api'));
app.all('*', (_req, res, _next) => {
    res.redirect('/');
})

global.throwError = function (name, message, errors, status) {
    const err = new Error();
    if(name) err.name = name;
    if(message) err.message = message;
    if(errors) err.errors = errors;
    if(status) err.status = status;
    throw err;
}

// Error handller
app.use((err, _req, res, _next) => {
    if(process.env.APP_ENV === 'development') {
        console.log(err);
    }
    res.status(err.status || 500).send({errors: err.errors, statusCode: err.status || 500, message: err.message, error: err.name});
});

module.exports = app;