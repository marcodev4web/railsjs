const User = require('../models/User');
const Controller = require('./Controller');

const UserController = new Controller(User);

UserController.create = function(req, res, next) {
    const user = new User();

    user.username = req.body.username;
    user._password = req.body.password;

    user.save().then(user => {
        res.status(201).send({user, success: true});
    }).catch(err => next(err));
}

UserController.update =  function (req, res, next) {
    User.findById(req.params.id).then(user => {
        if(!user) return res.status(404).send({errors: [{msg: 'User Not Found'}]});

        user.username = req.body.username;
        user._password = req.body.password;

        user.save().then(user => {
            res.send({user, success: true});
        });
    }).catch(err => next(err));
}

module.exports = UserController;