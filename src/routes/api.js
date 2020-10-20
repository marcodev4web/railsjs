/**
 * Api routes
 * @module src/routes/api
 */

const router = require('./router.js');
const UserController = require('../controllers/UserController');

// Auth routes
router.auth();

// Define Routes here
router.resource('/users', UserController);

module.exports = router;