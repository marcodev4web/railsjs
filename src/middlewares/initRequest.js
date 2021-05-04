module.exports = (req, res, next) => {
    req.$res = {};
    req.$body = {};
    req.$data = {};
    next();
}