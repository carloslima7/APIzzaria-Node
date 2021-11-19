const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const CashFlow = require("../model/cashflow")

router.use(authenticatedMiddleware)

router.get("/", async (req, res) => {
  try {
    const findFlow = await CashFlow.find({})
    return res.send({ findFlow })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" + err })
  }
})

module.exports = (app) => app.use("/cashflow", router)
