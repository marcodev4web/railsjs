/**
 * Router
 * @module src/routes/router
 */

const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const { body }  = require('express-validator');
const auth = require('../middlewares/auth');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

/**
 * Resource items
 * @param {string} path 
 * @param {...Function} handlers
 * @return void
 */
router.resource = function(path, ...handlers) {
    if(!path.endsWith('/')) {
        path += '/';
    }
    
    const controller = handlers.pop();
    const validator = handlers.pop();

    this.get(path, ...handlers, controller.find());
    this.post(path, ...handlers, validator.create, controller.create());
    this.get(path + ':id', ...handlers, controller.fetch());
    this.patch(path + ':id', ...handlers, validator.update, controller.update());
    this.delete(path + ':id', ...handlers, controller.delete());
}

/**
 * Add authentication routes
 * @return void
 */
router.auth = function () {
    this.post('/login', [
        body('username').notEmpty().trim().escape().withMessage("Username is Empty"),
        body('password').notEmpty().withMessage("Password is Empty"),
        handleValidationErrors
    ], AuthController.login);
    this.get('/logout', auth, AuthController.logout);
}

module.exports = router;