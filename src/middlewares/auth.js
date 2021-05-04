/**
 * Authentication middleware
 * @module src/middlewares/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @property The name of the filed stores the token
 */
const AUTH_TOKEN = 'Authorization'

/**
 * Determine if there is an authenticated user or not
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next 
 */
module.exports = async function (req, res, next) {
    try {
        let token = req.header(AUTH_TOKEN) || req.body[AUTH_TOKEN];
        if(token) token = token.split(' ')[1];
        
        try {
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findOne({_id: verifiedToken._id, _token: token}, {
                username: 1, fullname: 1, role: 1, _token: 1
            });
            if(!user) throwError('AuthError', 'Authentication Failed', null, 401);
    
            req.$auth = user;
            next()
        } catch (err) {
            throwError(err.name, err.message, null, 401);
        }
    } catch (err) {
        next(err)
    }
}