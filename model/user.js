const mongoose = require('../database')

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
    forgotToken: {
        type: String,
        select: false
    },
    expirationToken: {
        type: Date,
        select: false
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User