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

// Error handller
app.use((error, _req, res, _next) => {
    if(process.env.APP_ENV = 'development') {
        console.log(error)
    }
    res.status(500).send({errors: {msg: error.message}});
});

module.exports = app;