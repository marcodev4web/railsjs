const { body } = require('express-validator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const User = require('../models/User');

exports.register = [
    body('username').trim().escape().notEmpty().withMessage('Username is empty').bail()
        .isLength({min: 4}).withMessage('Username must be 4 chars at least').bail()
        .custom(async value => {
            if(await User.exists({username: value})) throw new Error('Username already exists');
        }),
    body('password').notEmpty().withMessage('Password is empty').bail()
        .isStrongPassword().withMessage('Password is weak'),
    handleValidationErrors
];

exports.login = [
    body('username').notEmpty().trim().escape().withMessage("Username is Empty"),
    body('password').notEmpty().withMessage("Password is Empty"),
    handleValidationErrors
];