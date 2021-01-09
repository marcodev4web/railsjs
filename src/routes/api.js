/**
 * Api routes
 * @module src/routes/api
 */

const router = require('./router');
const UserController = require('../controllers/UserController');
const userValidator = require('../validators/userValidator');

// Auth routes
router.auth();

// Define Routes here
router.resource('/users', userValidator, UserController);

module.exports = router;