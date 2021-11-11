const express = require("express")
const router = express.Router()
const middleware = require("../middleware/authenticated")
const Payment = require("../model/payment")

router.use(middleware)

router.get("/", async (req, res) => {
  try {
    const payment = await Payment.find({})
    return res.send({ payment })
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
    if (await Payment.findOne({ paymentCode })) {
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

    if (!(await Payment.findOne({ paymentCode }))) {
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

    if (!(await Payment.findOne({ paymentCode }))) {
      return res.status(400).send({ error: "Payment not exist" })
    }

    await Payment.findOneAndDelete({ paymentCode })
    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" })
  }
})

module.exports = (app) => app.use("/payment", router)
