/**
 * Router
 * @module src/routes/router
 */

const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middlewares/auth');
const authValidator = require('../validators/auth');

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
router.auth = function (options = {}) {
    this.post('/login', authValidator.login, AuthController.login);
    this.post('/logout', auth, AuthController.logout);
    this.get('/auth', auth, AuthController.auth);

    if(options.register) {
        this.post('/register', authValidator.register, AuthController.register);
    }
}

module.exports = router;
