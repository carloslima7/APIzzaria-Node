const mongoose = require("../database")

const OrderSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
    unique: true,
  },
  customerCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  items: [
    {
      itemCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0.0,
      },
      cost: {
        type: Number,
        required: true,
        default: 0.0,
      },
      pricetotal: {
        type: Number,
        required: true,
        default: 0.0,
      },
    },
  ],
  deliveryTax: {
    type: Number,
    required: true,
    default: 0.0,
  },
  payment: {
    type: Number,
    required: true,
  },
  paymentTax: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalItens: {
    type: Number,
    required: true,
    default: 0.0,
  },
  docTotal: {
    type: Number,
    required: true,
    default: 0.0,
  },
  finished: {
    type: String,
    required: true,
    default: "N",
  },
})

const Order = mongoose.model("Order", OrderSchema)

module.exports = Order
