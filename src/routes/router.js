/**
 * Router
 * @module src/routes/router
 */

const router = require('express').Router();

/**
 * Resource items
 * @param {string} path 
 * @param {Controller} controller
 * @return void
 */
router.resource = function(path, controller) {
    if(path.charAt(path.length - 1) !== '/') {
        path += '/';
    }

    this.get(path, controller.find);
    this.post(path, controller.create);
    this.get(path + ':id', controller.get);
    this.patch(path + ':id', controller.update);
    this.delete(path + ':id', controller.delete);
}

module.exports = router;