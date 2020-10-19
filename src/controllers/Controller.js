/**
 * Controller
 * @module src/controllers/Controller
 */

/**
 * Base Controller
 * @constructor
 */
function Controller() {};

/**
 * The model assigned to the controller
 * @var {Mongoose.Model}
 */
Controller._model;

/**
 * Prepare request query to database
 * @param {object} queries Request query
 * @return {object} 
 */
Controller.prepareQueries = function (queries) {
    const filter = {};

    for (const query in queries) {
        if(queries[query] && query !== 'search') {
            filter[query] = queries[query];
        }
    }

    if(queries.search) {
        filter.$text = {$search: queries.search};
    }

    return filter;
}

/**
 * Get item by id and pass it to cb
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next
 * @param {function} cb Callback
 * @return void
 */
Controller.getById = function (req, res, next, cb) {
    Controller._model.findById(req.params.id).then(item => {
        if(!item) {
            return res.status(404).send({errors: [{message: Controller._model.modelName + ' Not Found'}]});
        }
        cb(item);
    }).catch(err => next(err));
}

/**
 * Assign the model to the controller
 * @param {Mongoose.Model} model The model to be assigned
 * @returns void
 */
Controller.prototype.setModel = function (model) {
    Controller._model = model
}

/**
 * Get the name of the model assigned to the controller
 * @return {String} Model name
 */
Controller.prototype.getModel = function () {
    return Controller._model.modelName;
}

/**
 * Find items with query filters
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next
 * @return void
 */
Controller.prototype.find = function(req, res, next) {
    const filter = Controller.prepareQueries(req.query);

    Controller._model.find(filter).then(items => {
        res.send(items)
    }).catch(err => next(err));
}

/**
 * Create new item
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} next
 * @return void
 */
Controller.prototype.create = function (req, res, next) {
    const model = new Controller._model();

    for (const key in req.body) {
        model[key] = req.body[key];
    }

    model.save().then(item => {
        res.send({success: true})
    }).catch(err => next(err))
}

/**
 * Find item by id route param
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next
 * @return void
 */
Controller.prototype.get = function(req, res, next) {
    Controller.getById(req, res, next, item => {
        res.send(item);
    });
}

/**
 * Update item by id route param
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next
 * @return void
 */
Controller.prototype.update = function (req, res, next) {
    Controller.getById(req, res, next, item => {
        for (const param in req.body) {
            item[param] = req.body[param]
        }

        item.save().then(item => {
            res.send({[Controller._model.modelName.toLowerCase()]: item, success: true})
        }).catch()
    });
}

/**
 * Delete item by id route param
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next
 * @return void
 */
Controller.prototype.delete = function (req, res, next) {
    Controller.getById(req, res, next, item => {
        item.remove().then(_item => {
            res.send({success: true})
        }).catch();
    });
}

module.exports = Controller