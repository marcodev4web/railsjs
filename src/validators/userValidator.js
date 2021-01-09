const { body } = require('express-validator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const User = require('../models/User');

exports.create = [
    body('username').trim().escape().notEmpty().withMessage('Username is empty').bail()
        .isLength({min: 4}).withMessage('Username must be 4 chars at least').bail()
        .custom(async value => {
            if(await User.exists({username: value})) throw new Error('Username already exists');
        }),
    body('password').notEmpty().withMessage('Password is empty').bail()
        .isStrongPassword().withMessage('Password is weak'),
    handleValidationErrors
];

exports.update = [
    body('username').optional().trim().escape().notEmpty().withMessage('Username is Empty')
        .isLength({min: 4}).withMessage('Username must be 4 chars at least')
        .custom(async value => {
            if(await User.exists({username: value})) throw new Error('Username already exists');
        }),
    body('password').optional().isStrongPassword().withMessage('Password is weak'),
    handleValidationErrors
];