const mongoose = require('mongoose')

const UserSchema = new Schema({
    login: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    fullName: {
        type: String,
        require: true
    },
    forgotToken: String,
    expirationToken: Date
})

const User = mongoose.model('User', UserSchema)

module.exports = User