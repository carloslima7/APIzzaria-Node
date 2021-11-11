const mongoose = require("../database")

const CashFlowSchema = new mongoose.Schema({
  cashIn: [
    {
      order: Number,
      date: Date,
      total: Number,
      reconciled: String,
    },
  ],
  cashOut: [
    {
      order: Number,
      date: Date,
      total: Number,
      reconciled: String,
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  total: Number,
})

const CashFlow = mongoose.model("CashFlow", CashFlowSchema)

module.exports = CashFlow
