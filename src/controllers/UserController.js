const User = require('../models/User');
const Controller = require('./Controller');

const UserController = new Controller(User);

UserController._filter = function (data) {
    const filteredData = {};

    if(data.username) filteredData.username = data.username;
    if(data.password) filteredData._password = data.password;

    return filteredData;
};

module.exports = UserController;