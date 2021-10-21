const mongoose = require('mongoose')

const OrderSchema = new Schema({
    order: {
        type: Number,
        require: true,
        unique: true
    },
    customerCode: {
        type: String,
        require: true
    },
    customer: {
        type: String,
        require: true
    },
    items: {
        itemCode: {
            type: String,
            require: true
        },
        itemName: {
            type: String,
            require: true
        },
        quantity: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            require: true,
            default: 0.00
        },
        cost: {
            type: Number,
            require: true,
            default: 0.00
        }
    },
    deliveryTax: {
        type: Number,
        require: true,
        default: 0.00
    },
    payment: {
        type: Number,
        require: true
    },
    paymentTax: {
        type: Number,
        require: true,
        default: 0.00
    },
    totalItens: {
        type: Number,
        require: true,
        default: 0.00
    },
    docTotal: {
        type: Number,
        require: true,
        default: 0.00
    },
    finished: {
        type: String,
        require: true,
        default: 'N'
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order