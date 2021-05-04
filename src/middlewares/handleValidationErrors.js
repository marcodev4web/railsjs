/**
 * Handle validation error
 * @module src/middlewares/handleValidationErrors
 */

const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throwError('ValidationError', "Array", errors.array(), 400);
    }
    next();
}