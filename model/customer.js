const mongoose = require('../database')

const CustomerShcema = new mongoose.Schema({
    customerCode: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        streetNo: {
            type: String,
            required: true
        },
        building: String,
        block: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        reference: String

    }
})

const Customer = mongoose.model('Customer', CustomerShcema)

module.exports = Customer
