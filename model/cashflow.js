const mongoose = require("../database")

const CashFlowSchema = new mongoose.Schema({
  orders: [
    {
      orderCode: {
        type: Number,
        required: true,
        unique: true,
      },
      docTotal: Number,
    },
  ],
  date: {
    type: String,
    required: true,
  },
  lucroTotal: {
    type: Number,
    default: 0,
  },
})

const CashFlow = mongoose.model("CashFlow", CashFlowSchema)

module.exports = CashFlow
