const fs = require('fs');
const path = require('path');

module.exports = (err, req, res, _next) => {
    if(req.app.set('env') === 'production') {
        const file = fs.createWriteStream(path.join(__dirname, '../logs/requests.log'), {flags: 'a'});
        file.write(err.stack + " \n\n", e => {
            err = e;
        })
        file.close();
    } else {
        console.log(err);
    }

    res.status(err.code || 500).send({errors: err.errors, statusCode: err.code || 500, message: err.message, error: err.name});
}