const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    _password: {
        type: String,
        required: true,
        select: false
    },
    _token: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

schema.pre('save', function (next) {
    if (this.isModified('_password')) {
        this._password = bcrypt.hashSync(this._password);
    }
    next()
});

module.exports = mongoose.model('User', schema);