const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const baseSchema = require('./BaseSchema');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
    },
    role: {
        type: String
    },
    _password: {
        type: String,
        required: true,
        select: false
    },
    _token: {
        type: String,
        select: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

schema.add(baseSchema);

schema.methods.verifyPassword = function (password) {
    return bcrypt.compare(password, this._password);
}

schema.methods.addToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    this._token = token;
    return this.save();
}

schema.statics.$filter = function (data) {
    const filteredData = {};

    if(data.username) filteredData.username = data.username;
    if(data.password) filteredData._password = data.password;
    if(data.fullname) filteredData.fullname = data.fullname;
    if(data.role) filteredData.role = data.role;

    return filteredData;
}

schema.pre('save', async function (next) {
    if (this.isModified('_password')) {
        try {
            this._password = await bcrypt.hash(this._password, 10);
        } catch (err) {
            next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', schema);