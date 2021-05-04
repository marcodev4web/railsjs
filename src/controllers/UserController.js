const User = require('../models/User');
const Controller = require('./Controller');

const UserController = new Controller(User);

module.exports = UserController;
