const server = require('./src/server');
const mongoose = require('./src/db/mongoose');

// Run server
server.listen(process.env.PORT, async function() {
    console.log('Server Running...');
    try {
        // Connect to database
        await mongoose.$connect()
        console.log('Connected To Database');
    } catch (err) {
        console.log(err);
    }
});

server.on('listening', function(s) {
    console.log('Listening at port ' + this.address().port)
})