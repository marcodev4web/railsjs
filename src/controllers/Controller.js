/**
 * Base Controller
 * @param {Mongoose.Model} model
 * @constructor
 */
function Controller(model) {
    /**
     * @var {Controller} _this
     */
    const _this = this;

    /**
     * @var {mongoose.Model} _model
     */
    const _model = model;

    /**
     * Prepare request query to mongodb
     * @param {object} queries Request query
     * @return {object} 
     */
    function prepareQuery (queries) {
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
     * Before find hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeFind = function (req, res, next) {
        next();
    }

    /**
     * Find models
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$find = async function (req, res, next) {
        try {
            req.$models = await _this._find(req.query || req.body);
            next()
        } catch (err) {
            next(err);
        }
    }

    /**
     * After Find hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterFind = function (req, res, next) {
        next();
    }

    /**
     * Send response after find
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$sendAfterFind = function (req, res, next) {
        res.send(req.$models);
    }

    /**
     * Before fetch hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeFetch = function (req, res, next) {
        next();
    }

    /**
     * Fetch operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {function} next
     */
    this.$fetch = async function (req, res, next) {
        try {
            const model = await _model.findById(req.params.id);
            if(!model) {
                throwError('NotFoundError', _model.modelName + ' Not Found', null, 404);
            }
            req.$model = model;
            next()
        } catch (err) {
            next(err)
        }
    }

    /**
     * After Fetch hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterFetch = function (req, res, next) {
        next();
    }

    /**
     * Send response after fetch
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$sendAfterFetch = function (req, res, next) {
        res.send(req.$model);
    }

    /**
     * Filter body before create endpoint
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$filterBeforeCreate = function (req, res, next) {
        req.$body = _this._filter(req.body);
        next();
    }

    /**
     * Before save hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeSave = function (req, res, next) {
        next()
    }

    /**
     * After save hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterSave = function (req, res, next) {
        next()
    }

    /**
     * Before create hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeCreate = function (req, res, next) {
        next();
    }

    /**
     * Create operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$create = async function (req, res, next) {
        try {
            req.$model = await _this._create(req.$body).save();
            next()
        } catch (err) {
            next(err);
        }
    }

    /**
     * After create hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterCreate = function (req, res, next) {
        next();
    }

    /**
     * Send response after create
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$sendAfterCreate = function (req, res, next) {
        res.status(201).send({[_model.modelName.toLowerCase()]: req.$model, success: true});
    }

    /**
     * Filter body before update endpoint
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$filterBeforeUpdate = function (req, res, next) {
        req.$body = _this._filter(req.body);
        next()
    }

    /**
     * Before update hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeUpdate = function (req, res, next) {
        next();
    }

    /**
     * Update operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$update = async function (req, res, next) {
        try {
            req.$model = await _this._update(req.$model, req.$body).save();
            next();
        } catch (err) {
            next(err);
        }
    }

    /**
     * After update hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterUpdate = function (req, res, next) {
        next();
    }

    /**
     * Send response after update
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$sendAfterUpdate = function (req, res, next) {
        res.send({[_model.modelName.toLowerCase()]: req.$model, success: true});
    }

    /**
     * Before delete hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$beforeDelete = function (req, res, next) {
        next();
    }

    /**
     * Delete operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$delete = async function (req, res, next) {
        try {
            req.$model = await req.$model.remove();
            next();
        } catch (err) {
            next(err);
        }
    }

    /**
     * After delete hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$afterDelete = function (req, res, next) {
        next();
    }

    /**
     * Send response after delete
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    this.$sendAfterDelete = function (req, res, next) {
        res.send({success: true});
    }

    /**
     * Find specifuc resources
     * @param {Object} query 
     */
    this._find = async function (query) {
        try {
            const { filter, sort, skip, limit } = prepareQuery(query);
            return await _model.find(filter).sort(sort).limit(limit).skip(skip);
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Filter Data
     * @param {Object} data Date to be filtered
     * @param {Boolean} private Skip params starts with underscore
     * @param {String[]} except List of exceptions
     * @return {Object} Filtered data
     */
    this._filter = function (data, private = true, except = []) {
        const filteredData = {};
        for (const param in data) {
            if(private && param.startsWith('_')) except.push(param);
            if(!except.includes(param)) filteredData[param] = data[param];
        }
        return filteredData;
    }

    /**
     * Bind data to the model
     * @param {Mongoose.Model} model Mongoose model
     * @param {Object} data The data to be bind
     * @return {Mongoose.Model} Mongoose Model
     */
    this._bind = function (model, data) {
        for (const param in data) {
            model[param] = data[param];
        }
        return model;
    }

    /**
     * Bind data to the model in create endpoint
     * @param {Object} data The data to be bind
     * @return {Mongoose.Model} Mongoose Model
     */
    this._create = function (data) {
        return this._bind(new _model(), data);
    }

    /**
     * Bind data to the model in update endpoint
     * @param {Mongoose.Model} model Mongoose model
     * @param {Object} data The data to be bind
     * @return {Mongoose.Model} Mongoose Model
     */
    this._update = function (model, data) {
        return this._bind(model, data);
    }

    /**
     * Find endpoint
     * @return {Function[]} Find hooks
     */
    this.find = function () {
        return [this.$beforeFind, this.$find, this.$afterFind, this.$sendAfterFind];
    }

    /**
     * Create endpoint
     * @return {Function[]} Create hooks
     */
    this.create = function () {
        return [this.$filterBeforeCreate, this.$beforeCreate, this.$beforeSave, this.$create, this.$afterSave, this.$afterCreate, this.$sendAfterCreate];
    };

    /**
     * Fetch endpoint
     * @return {Function[]} Fetch hooks
     */
    this.fetch = function () {
        return [this.$beforeFetch, this.$fetch, this.$afterFetch, this.$sendAfterFetch];
    }

    /**
     * Update endpoint
     * @return {Function[]} Update hooks
     */
    this.update = function () {
        return [this.$fetch, this.$filterBeforeUpdate, this.$beforeUpdate, this.$beforeSave, this.$update, this.$afterSave, this.$afterUpdate, this.$sendAfterUpdate];
    }

    /**
     * Delete endpoint
     * @return {Function[]} Delete hooks
     */
    this.delete = function () {
        return [this.$fetch, this.$beforeDelete, this.$delete, this.$afterDelete, this.$sendAfterDelete];
    }
};

module.exports = Controller