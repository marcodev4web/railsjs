/**
 * Authentication middleware
 * @module src/middlewares/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @property The name of the filed stores token
 */
const AUTH_TOKEN = 'Authentication'

/**
 * Determine if there is an authenticated user or not
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next 
 */
module.exports = function (req, res, next) {
    const token = req.header(AUTH_TOKEN) || req.body[AUTH_TOKEN];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifiedToken);
    User.findOne({_id: verifiedToken._id, _token: token}).then(user => {
        if (!user) {
            return res.status(403).send({errors: [{msg: "Authentication Failed"}]});
        }
        req.auth = user;
        next();
    }).catch(err => next(err));
}