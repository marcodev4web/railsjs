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
 * Prepare request query to mongodb
 * @param {object} queries Request query
 * @return {object} 
 */
Controller.prepareQuery = function (queries) {
    let filter = {}, sort = {}, page = 0, limit = 0;

    for (const query in queries) {
        if(queries[query] && !query.startsWith('_')) {
            switch (query) {
                case 'search':
                    filter.$text = {$search: queries[query]}
                    break;
                case 'sort':
                    sort = prepareSort(queries[query]);
                    break;
                case 'limit':
                    limit = queries[query] > 0 ? +queries[query] : 0;
                    break
                case 'page':
                    page = queries[query] > 0 ? queries[query] - 1 : 0;
                    break;
                case 'range':
                    const ranges = prepareRange(queries[query]);
                    filter = {...filter, ...ranges};
                    break;
                default:
                    filter[query] = queries[query];
                    break;
            }
        }
    }

    const skip = page * limit;

    return {filter, sort, skip, limit};
}

/**
 * Convert sort query to mongodb sort object
 * @param {String} query sort query
 * @return {Object} Sort object to be used in mongodb
 */
function prepareSort(query) {
    const sort = {};

    const sortItems = query.split('|');

    sortItems.forEach(item => {
        const sortItem = item.split('_');
        const sortBy = sortItem[0];
        const sortOrder = sortItem[1] === 'desc' ? -1 : 1;

        sort[sortBy] = sortOrder;
    });

    return sort;
}

/**
 * Convert range from json format to mongodb filter object
 * @param {string} query range query in json format
 * @return {Object} Object to be used in mondodb filter
 */
function prepareRange(query) {
    const rangeQuery = JSON.parse(query);
    let range = {};

    for (const path in rangeQuery) {
        range[path] = {
            $gte: rangeQuery[path].from,
            $lte: rangeQuery[path].to,
        }
    }

    return range;
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
    const { filter, sort, skip, limit } = Controller.prepareQuery(req.query);

    Controller._model.find(filter).sort(sort).limit(limit).skip(skip).then(items => {
        res.send(items);
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

    model.save().then(_item => {
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