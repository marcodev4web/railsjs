const mongoose = require('mongoose');

const ENV = process.env.NODE_ENV.toUpperCase();

// Define connection uri
const {
    [ENV + '_DB_HOST']: HOST,
    [ENV + '_DB_PORT']: PORT,
    [ENV + '_DB_USER']: USER,
    [ENV + '_DB_PASSWORD']: PASSWORD,
    [ENV + '_DB_NAME']: NAME,
    [ENV + '_DB_SRV']: SRV,
    [ENV + '_DB_OPTIONS']: OPTIONS,
} = process.env;

let uri = 'mongodb';

if(SRV === 'true') uri += '+srv';

uri += '://';

if(USER) {
    uri += USER;
    if(PASSWORD) uri += (':' + PASSWORD);
    uri += '@';
}

uri += HOST;

if(SRV !== 'true') uri += (':' + PORT);

uri += '/' + NAME;

if(OPTIONS) uri += '?' + OPTIONS;

// Connect to mongodb server
mongoose.$connect = function () {
    return this.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = mongoose;