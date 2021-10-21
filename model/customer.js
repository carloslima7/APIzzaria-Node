const mongoose = require('mongoose')

const CustomerShcema = new Schema({
    customerCode: {
        type: String,
        require: true,
        unique: true
    },
    customer: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        street: {
            type: String,
            require: true
        },
        streetNo: {
            type: String,
            require: true
        },
        building: String,
        block: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        zipCode: {
            type: String,
            require: true
        },
        reference: String

    }
})

const Customer = mongoose.model('Customer', CustomerShcema)

module.exports = Customer
