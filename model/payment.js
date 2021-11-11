const mongoose = require("../database")

const PaymentSchema = new mongoose.Schema({
  paymentCode: {
    type: String,
    required: true,
    unique: true,
  },
  paymentName: {
    type: String,
    required: true,
  },
  paymentTax: {
    type: Number,
    default: 0.0,
  },
})

const Payment = mongoose.model("Payment", PaymentSchema)

module.exports = Payment
