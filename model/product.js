const mongoose = require("../database")

const ProductSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0.0,
  },
  cost: {
    type: Number,
    default: 0.0,
  },
  stock: {
    type: Number,
    default: 0.0,
  },
  feedStock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  createUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
