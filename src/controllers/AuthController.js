/**
 * Authentication Service
 * @module src/controllers/AuthController
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

// Auth path in database
const AUTH_FIELD = 'username';

/**
 * Login
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.login = function(req, res, next) {
    User.findOne({[AUTH_FIELD]: req.body[AUTH_FIELD]}).select('_password')
    .then(user => {
        if(!user || !bcrypt.compareSync(req.body.password, user._password)) {
            return res.status(400).send({errors: [{msg: "Authentication Failed"}]});
        }

        const token = jwt.sign(user, process.env.JWT_SECRET);
        user._token = token;
        user.save().then(user => {
            res.send({success: true, user});
        }).catch(err => next(err));
    }).catch(err => next(err));
}

/**
 * Logout
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
module.exports.logout = function(req, res, next) {
    const user = req.auth;
    user._token = undefined;
    user.save().then(_user => {
        res.send({success: true});
    }).catch(err => next(err));
}