const server = require('./src/server.js');

// Run server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server Running...')
});
