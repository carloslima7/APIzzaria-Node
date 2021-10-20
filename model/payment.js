const mongoose = require('mongoose')

const PaymentSchema = new Schema({
    paymentCode: {
        type: String,
        require: true,
        unique: true
    },
    paymentName: {
        type: String,
        require: true
    },
    paymentTax: {
        type: Number,
        default: 0.00
    }
})

const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = Payment