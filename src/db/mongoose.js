const mongoose = require('mongoose');

// Connect to mongodb server
mongoose.$connect = function () {
    const ENV = process.env.NODE_ENV.toUpperCase();

    // Define connection uri
    const {
        [ENV + '_DB_HOST']: HOST,
        [ENV + '_DB_PORT']: PORT,
        [ENV + '_DB_USER']: USER,
        [ENV + '_DB_PASSWORD']: PASSWORD,
        [ENV + '_DB_NAME']: NAME
    } = process.env;

    let uri = 'mongodb://';

    if(USER) {
        uri += USER;
        if(PASSWORD) uri += (':' + PASSWORD);
        uri += '@';
    }

    uri += HOST + ':' + PORT + '/' + NAME;

    return this.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = mongoose;