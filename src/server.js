/**
 * Express Web Server
 * @module src/server
 */

// Config environment variables
require('dotenv').config();

// Include libs
const express = require('express');
const app = express();
const logger = require('./loggers/morgan.js');

// Config Server
app.use(logger);
app.use(express.static('./src/public'));
app.use(express.json());
app.use('/api', require('./routes/api.js'));
app.all('*', (_req, res) => {
    res.redirect('/');
});

// Connect to database
require('./db/mongoose');

app.use((error, _req, res, _next) => {
    res.status(500).send({errors: {message: error.message}});
})

// Listen
app.listen(process.env.PORT || 3000, () => {
    console.log('Server Running...')
});

module.exports = app;