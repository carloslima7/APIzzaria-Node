const mongoose = require('../database')

const ProductSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    itemName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0.00
    },
    cost: {
        type: Number,
        default: 0.00
    },
    stock: {
        type: Number,
        default: 0.00
    },
    feedStock: {
        feedCode: String,
        feedName: String,
        cost: {
            type: Number,
            default: 0.00
        }
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    createUser: {
        type: String,
        required: true
    }
}
)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;