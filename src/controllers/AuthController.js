/**
 * Authentication Service
 * @module src/controllers/AuthController
 */

const User = require('../models/User.js');

// Auth path in database
const AUTH_FIELD = 'username';

/**
 * Login
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.login = async function(req, res, next) {
    try {
        let user = await User.findOne({[AUTH_FIELD]: req.body[AUTH_FIELD]}, {_password: 1, [AUTH_FIELD]: 1, fullname: 1, role: 1});
    
        if(!user || !await user.verifyPassword(req.body.password)) {
            throwError('AuthError', 'Authentication Failed', null, 400);
        }

        user = await user.addToken();
        res.send({user, success: true});
    } catch (err) {
        next(err)
    }
}

/**
 * Register
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.register = async function Register(req, res, next) {
    try {
        let user = new User();

        user[AUTH_FIELD] = req.body[AUTH_FIELD];
        user._password = req.body.password;
        user.fullname = req.body.fullname

        user = await user.save();
        user = await user.addToken();
        res.status(201).send({user, success: true});
    } catch (err) {
        next(err)
    }
}

/**
 * Logout
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.logout = async function(req, res, next) {
    try {
        let user = req.$auth;
        user._token = undefined;
        user = await user.save();
        res.send({success: true});
    } catch (err) {
        next(err);
    }
}

/**
 * Authenticated user
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.auth = function (req, res, next) {
    res.send({user: req.$auth});
}