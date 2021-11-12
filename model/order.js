const mongoose = require("../database")

const OrderSchema = new mongoose.Schema({
  orderCode: {
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
      priceOrder: {
        type: Number,
        required: true,
        default: 0.0,
      },
      costOrder: {
        type: Number,
        required: true,
        default: 0.0,
      },
      priceTotal: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
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
