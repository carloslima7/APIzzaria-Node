const mongoose = require('mongoose')

const ProductSchema = new Schema({
    itemCode: {
        type: String,
        require: true,
        unique: true,
        uppercase: true
    },
    itemName: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
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
        require: true
    }
}
)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;