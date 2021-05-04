module.exports = (function Controller() {

    /**
     * Base Controller
     * @constructor
     */
    function Controller(model) {
        this._model = model;
    }

    /**
     * Before find hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeFind = function (req, res, next) {
        next()
    }

    /**
     * Find models
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$find = async function (req, res, next) {
        try {
            const result = this._model.$find(req.query);
            req.$data = await result.data;
            req.$res.data = [...req.$data];
            req.$res.count = await result.count;
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
    Controller.prototype.$afterFind = function (req, res, next) {
        next();
    }

    /**
     * Before fetch hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeFetch = function (req, res, next) {
        next();
    }

    /**
     * Fetch operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {function} next
     */
    Controller.prototype.$fetch = async function (req, res, next) {
        try {
            const model = await this._model.$fetch({_id: req.params.id, ...req.query});
            if(!model) {
                throwError('NotFoundError', this._model.modelName + ' Not Found', null, 404);
            }
            req.$data = model;
            req.$res.data = req.$data;
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
    Controller.prototype.$afterFetch = function (req, res, next) {
        next();
    }

    /**
     * Filter body before create endpoint
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$filterBeforeCreate = function (req, res, next) {
        req.$body = this._model.$filter(req.body);
        next();
    }

    /**
     * Before save hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeSave = function (req, res, next) {
        next()
    }

    /**
     * After save hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$afterSave = function (req, res, next) {
        next()
    }

    /**
     * Before create hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeCreate = function (req, res, next) {
        next();
    }

    /**
     * Create operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$create = async function (req, res, next) {
        try {
            req.$data = await this._model.$add(req.$body).save();
            req.$res.data = req.$data;
            req.$res.success = true;
            res.status(201);
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
    Controller.prototype.$afterCreate = function (req, res, next) {
        next();
    }

    /**
     * Filter body before update endpoint
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$filterBeforeUpdate = function (req, res, next) {
        req.$body = this._model.$filter(req.body);
        next()
    }

    /**
     * Before update hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeUpdate = function (req, res, next) {
        next();
    }

    /**
     * Update operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$update = async function (req, res, next) {
        try {
            req.$data = await this._model.$edit(req.$data, req.$body).save();
            req.$res.data = req.$data;
            req.$res.success = true;
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
    Controller.prototype.$afterUpdate = function (req, res, next) {
        next();
    }

    /**
     * Before delete hook
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$beforeDelete = function (req, res, next) {
        next();
    }

    /**
     * Delete operation
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next 
     */
    Controller.prototype.$delete = async function (req, res, next) {
        try {
            req.$data = await req.$data.remove();
            req.$res.success = true;
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
    Controller.prototype.$afterDelete = function (req, res, next) {
        next();
    }

    /**
     * Send Response
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Function} next
     */
    Controller.prototype.$send = function (req, res, next) {
        res.send(req.$res);
    }

    Controller.prototype.find = function () {
        return [this.$beforeFind.bind(this), this.$find.bind(this), this.$afterFind.bind(this), this.$send.bind(this)];
    }
    
    Controller.prototype.fetch = function () {
        return [this.$beforeFetch.bind(this), this.$fetch.bind(this), this.$afterFetch.bind(this), this.$send.bind(this)];
    }

    Controller.prototype.create = function () {
        return [this.$filterBeforeCreate.bind(this), this.$beforeCreate.bind(this), this.$beforeSave.bind(this), this.$create.bind(this), this.$afterSave.bind(this), this.$afterCreate.bind(this), this.$send.bind(this)];
    }

    Controller.prototype.update = function () {
        return [this.$fetch.bind(this), this.$filterBeforeUpdate.bind(this), this.$beforeUpdate.bind(this), this.$beforeSave.bind(this), this.$update.bind(this), this.$afterSave.bind(this), this.$afterUpdate.bind(this), this.$send.bind(this)];
    }

    Controller.prototype.delete = function () {
        return [this.$fetch.bind(this), this.$beforeDelete.bind(this), this.$delete.bind(this), this.$afterDelete.bind(this), this.$send.bind(this)];
    }

    return Controller
})();