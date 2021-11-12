const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const Payment = require("../model/payment")

router.use(authenticatedMiddleware)

router.get("/:limit/:page", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit, 10)
    const page = parseInt(req.params.page, 10)
    const numberOfPayments = await Payment.find().count()
    const factor = Math.ceil(numberOfPayments / limit)
    const skip = limit * (page - 1)

    if (page > factor || page < 1) {
      return res.status(400).send({ error: "Page not exist" })
    }

    const payments = await Payment.find({})
      .sort({ login: 1 })
      .skip(skip)
      .limit(limit)

    return res.send({ payments, pages: factor, totalRecords: numberOfPayments })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" })
  }
})

router.get("/:paymentCode", async (req, res) => {
  try {
    const paymentCode = req.params.paymentCode
    const payment = await Payment.findOne({ paymentCode })
    return res.send({ payment })
  } catch (err) {
    return res.status(400).send({ error: "Search failed, try again" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { paymentCode } = req.body
    const findPayment = await Payment.findOne({ paymentCode })
    if (findPayment) {
      return res.status(400).send({ error: "Payment already exists" })
    }
    const payment = await Payment.create(req.body)
    return res.send({ payment })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" })
  }
})

router.put("/:paymentCode", async (req, res) => {
  try {
    const { paymentName, paymentTax } = req.body
    const paymentCode = req.params.paymentCode
    const findPayment = await Payment.findOne({ paymentCode })
    if (!findPayment) {
      return res.status(400).send({ error: "Payment not exist" })
    }
    const payment = await Payment.findOneAndUpdate(
      { paymentCode },
      { paymentName, paymentTax },
      { new: true }
    )
    return res.send({ payment })
  } catch (err) {
    return res.status(400).send({ error: "Update failed, try again" })
  }
})

router.delete("/:paymentCode", async (req, res) => {
  try {
    const paymentCode = req.params.paymentCode
    const findPayment = await Payment.findOne({ paymentCode })
    if (!findPayment) {
      return res.status(400).send({ error: "Payment not exist" })
    }

    const deletePayment = await Payment.findOneAndDelete({ paymentCode })
    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" })
  }
})

module.exports = (app) => app.use("/payment", router)
