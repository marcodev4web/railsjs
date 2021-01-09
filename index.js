const server = require('./src/server');
const db = require('./src/db/mongoose');

// Run server
server.listen(process.env.PORT, () => {
    console.log('Server Running...');

    // Connect to database
    db.connect();
});