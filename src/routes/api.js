/**
 * Api routes
 * @module src/routes/api
 */

const router = require('./router');

// Middlewares
const auth = require('../middlewares/auth');

// Controllers
const UserController = require('../controllers/UserController');

// Validators
const userValidator = require('../validators/user');

// Auth routes
router.auth();

// Define Routes here
router.resource('/users', userValidator, UserController);

module.exports = router;