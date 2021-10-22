const mongoose = require('../database')

const OrderSchema = new mongoose.Schema({
    order: {
        type: Number,
        required: true,
        unique: true
    },
    customerCode: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    items: {
        itemCode: {
            type: String,
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0.00
        },
        cost: {
            type: Number,
            required: true,
            default: 0.00
        }
    },
    deliveryTax: {
        type: Number,
        required: true,
        default: 0.00
    },
    payment: {
        type: Number,
        required: true
    },
    paymentTax: {
        type: Number,
        required: true,
        default: 0.00
    },
    totalItens: {
        type: Number,
        required: true,
        default: 0.00
    },
    docTotal: {
        type: Number,
        required: true,
        default: 0.00
    },
    finished: {
        type: String,
        required: true,
        default: 'N'
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order