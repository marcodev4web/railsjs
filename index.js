const server = require('./src/server.js');

// Run server
server.listen(process.env.PORT, () => {
    console.log('Server Running...')
});