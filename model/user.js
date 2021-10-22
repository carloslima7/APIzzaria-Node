const mongoose = require('../database')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    forgotToken: String,
    expirationToken: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User