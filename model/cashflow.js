const mongoose = require("../database")

const CashFlowSchema = new mongoose.Schema({
  lucroTotal: {
    type: Number,
    default: 0,
  },
})

const CashFlow = mongoose.model("CashFlow", CashFlowSchema)

module.exports = CashFlow
