const mongoose = require('mongoose');

const schema = new mongoose.Schema();

// Private key to ignore
const PRIVATE_KEY = '_';

/**
 * Convert Hhtp query to MongoDB filter query
 * @param {String} query Http query
 */
function toMongoFilterQuery(query) {
    let params, operator = '$in'
    if(query.startsWith('!')) {
        operator = '$nin';
        query = query.substring(1);
    }

    params = query.split('|');
    if(params.length > 1 || operator === '$nin') return {[operator]: params}

    params = query.split(':');
    if(params.length === 2) {
        if(params[0]) {
            if(params[1]) return {$gte: params[0], $lte: params[1]}
            return {$gte: params[0]}
        } else {
            if(params[1]) return {$lte: params[1]}
        }
    }

    return query;
}

/**
 * Convert http query to mongodb projection query
 * @param {String} query Http query
 */
function toMongoProjectQuery(query) {
    let operator = 1
    const project = {};

    if(query.startsWith('!')) {
        query = query.substring(1);
        operator = 0;
    }
    const params = query.split('|');

    params.forEach(param => {
        if(param) project[param] = operator;
    })

    return project;
}

/**
 * Prepare request query to database
 * @param {object} queries Request query
 * @return {object} 
 */
function buildQuery (queries) {
    let filter = {}, project = {}, sort = {}, page = 0, limit = 0;

    for (const query in queries) {
        if(!query.startsWith(PRIVATE_KEY)) {
            switch (query) {
                case 'search':
                    filter.$text = {$search: queries[query]}
                    break;
                case 'sort':
                    sort = toMongoSortQuery(queries[query]);
                    break;
                case 'limit':
                    limit = queries[query] > 0 ? +queries[query] : 0;
                    break
                case 'page':
                    page = queries[query] > 0 ? queries[query] - 1 : 0;
                    break;
                case 'select':
                    project = toMongoProjectQuery(queries[query]);
                    break;
                default:
                    filter[query] = toMongoFilterQuery(queries[query]);
            }
        }
    }

    const skip = page * limit;
    return {filter, project, sort, skip, limit};
}

/**
 * Convert sort query to database sort object
 * @param {String} query http query
 * @return {Object} Sort object to be used in database
 */
function toMongoSortQuery(query) {
    const sort = {};
    const sortItems = query.split('|');

    sortItems.forEach(item => {
        const sortItem = item.split('-');
        const sortBy = sortItem[0];
        const sortOrder = sortItem[1] === 'desc' ? -1 : 1;

        if(sortBy) sort[sortBy] = sortOrder;
    });

    return sort;
}

/**
 * Bind data to the model
 * @param {Object} data The data to be bind
 * @return {Mongoose.Model} Mongoose Model
 */
schema.methods._bind = function (data) {
    for (const param in data) {
        this[param] = data[param];
    }
    return this;
};

/**
 * Find specific resources
 * @param {Object} query 
 */
schema.statics.$find = function (query) {
    const { filter, project, sort, skip, limit } = buildQuery(query);
    return {
        data: this.find(filter, project).sort(sort).limit(limit).skip(skip),
        count: this.countDocuments(filter)
    }
}

/**
 * Find specific resource
 * @param {Object} query 
 */
schema.statics.$fetch = function (query) {
    const project = query.select ? toMongoProjectQuery(query.select) : {};
    return this.findById(query._id, project);
}

/**
 * Filter Data
 * @param {Object} data Date to be filtered
 * @param {Boolean} private Skip params starts with private key
 * @param {String[]} except List of exceptions
 * @return {Object} Filtered data
 */
schema.statics.$filter = function (data, private = true, except = []) {
    const filteredData = {};
    for (const param in data) {
        if(private && param.startsWith(PRIVATE_KEY)) except.push(param);
        if(!except.includes(param)) filteredData[param] = data[param];
    }
    return filteredData;
}

/**
 * Bind data to the model in create endpoint
 * @param {Object} data The data to be bind
 * @return {Mongoose.Model} Mongoose Model
 */
schema.statics.$add = function (data) {
    const doc = new this;
    return doc._bind(data);
};

/**
 * Bind data to the model in update endpoint
 * @param {Mongoose.Document} doc Mongoose model
 * @param {Object} data The data to be bind
 * @return {Mongoose.Model} Mongoose Model
 */
schema.statics.$edit = function (doc, data) {
    return doc._bind(data);
}

module.exports = schema