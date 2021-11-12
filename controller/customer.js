const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const Customer = require("../model/customer")

router.use(authenticatedMiddleware)

router.get("/:limit/:page", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit, 10)
    const page = parseInt(req.params.page, 10)
    const numberOfCustomers = await Customer.find().count()
    const factor = Math.ceil(numberOfCustomers / limit)
    const skip = limit * (page - 1)

    if (page > factor || page < 1) {
      return res.status(400).send({ error: "Page not exist" })
    }

    const customers = await Customer.find({})
      .sort({ itemCode: 1 })
      .skip(skip)
      .limit(limit)

    return res.send({
      customers,
      pages: factor,
      totalRecords: numberOfCustomers,
    })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" })
  }
})

router.get("/:customerCode", async (req, res) => {
  try {
    const customerCode = req.params.customerCode
    const customer = await Customer.findOne({ customerCode })
    return res.send({ customer })
  } catch (err) {
    return res.status(400).send({ error: "Search failed, try again" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { customerCode } = req.body
    const findCustomer = await Customer.findOne({ customerCode })

    if (findCustomer) {
      return res.status(400).send({ error: "Customer already exists" })
    }
    const customer = await Customer.create(req.body)
    return res.send({ customer })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" })
  }
})

router.put("/:customerCode", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      streetNo,
      building,
      block,
      city,
      state,
      zipCode,
      reference,
    } = req.body
    const customerCode = req.params.customerCode
    const findCustomer = await Customer.findOne({ customerCode })
    if (!findCustomer) {
      return res.status(400).send({ error: "Customer not exist" })
    }
    const customer = await Customer.findOneAndUpdate(
      { customerCode },
      {
        customerName,
        phone,
        address,
        streetNo,
        building,
        block,
        city,
        state,
        zipCode,
        reference,
      },
      { new: true }
    )
    return res.send({ customer })
  } catch (err) {
    return res.status(400).send({ error: "Update failed, try again" })
  }
})

router.delete("/:customerCode", async (req, res) => {
  try {
    const customerCode = req.params.customerCode
    const findCustomer = await Customer.findOne({ customerCode })
    if (!findCustomer) {
      return res.status(400).send({ error: "Customer not exist" })
    }

    const deleteCustomer = await Customer.findOneAndDelete({ customerCode })
    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" })
  }
})

module.exports = (app) => app.use("/customer", router)
