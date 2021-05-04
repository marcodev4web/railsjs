/**
 * Expresso
 * @module src/app
 */

// Config environment variables
require('dotenv').config();

// Include libs
const path = require('path');
const express = require('express');
const helmet = require('helmet');

// Init app
const app = express();

// Global Middlewares
const morgan = require('./middlewares/morgan');
const errorHandler = require('./middlewares/errorHandler');
const initRequest = require('./middlewares/initRequest');

// Config Server
app.use(morgan);
app.use(helmet({}))
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(initRequest)
app.use('/api', require('./routes/api'));
app.all('*', (_req, res, _next) => {
    res.redirect('/');
})

/**
 * Throws an error
 * @param {String} name Error name
 * @param {String} message Error message
 * @param {Array} errors Array of errors
 * @param {Number} code Error code
 */
global.throwError = function (name, message, errors, code) {
    const err = new Error();
    if(name) err.name = name;
    if(message) err.message = message;
    if(errors) err.errors = errors;
    if(code) err.code = code;
    throw err;
}

// Error handller
app.use(errorHandler);

module.exports = app;