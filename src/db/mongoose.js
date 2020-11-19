const mongoose = require('mongoose');

// Define connection uri
const {
    DB_HOST: HOST,
    DB_PORT: PORT,
    DB_USER: USER,
    DB_PASSWORD: PASSWORD,
    DB_NAME: NAME
} = process.env;

let uri = 'mongodb://';
if(USER) {
    uri += USER;
    if(PASSWORD) uri += (':' + PASSWORD);
    uri += '@';
}
uri += HOST + ':' + PORT + '/' + NAME;

// Connect to mongodb server

exports.connect = function () {
    mongoose.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(_mongoose => {
        console.log('Connected to Database');
    }).catch(err => console.log(err));
}

exports.disconnect = function () {
    mongoose.disconnect().catch(err => console.log(err));
}