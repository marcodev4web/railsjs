/**
 * Router
 * @module src/routes/router
 */

const router = require('express').Router();
const AuthController = require('../controllers/AuthController.js');
const { body }  = require('express-validator');
const auth = require('../middlewares/auth.js');
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

    this.get(path, ...handlers, controller.find);
    this.post(path, ...handlers, controller.create);
    this.get(path + ':id', ...handlers, controller.get);
    this.patch(path + ':id', ...handlers, controller.update);
    this.delete(path + ':id', ...handlers, controller.delete);
}

/**
 * Add authentication routes
 * @return void
 */
router.auth = function () {
    this.post('/login', [
        body('username').trim().escape().notEmpty().withMessage("Username is Empty"),
        body('password').trim().escape().notEmpty().withMessage("Password is Empty"),
        handleValidationErrors
    ], AuthController.login);
    this.get('/logout', auth, AuthController.logout);
}

module.exports = router;