const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const Order = require("../model/order")
const Payment = require("../model/payment")
const Product = require("../model/product")

router.use(authenticatedMiddleware)
//feito
router.get("/:limit/:page", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit, 10)
    const page = parseInt(req.params.page, 10)
    const numberOfOrders = await Order.find().count()
    const factor = Math.ceil(numberOfOrders / limit)
    const skip = limit * (page - 1)

    if (page > factor || page < 1) {
      return res.status(400).send({ error: "Page not exist" })
    }

    const orders = await Order.find({})
      .populate("customerCode")
      .populate("payment")
      .populate("items.itemCode")
      .sort({ orderCode: 1 })
      .skip(skip)
      .limit(limit)

    return res.send({
      orders,
      pages: factor,
      totalRecords: numberOfOrders,
    })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" + err })
  }
})
//feito
router.get("/:orderCode", async (req, res) => {
  try {
    const orderCode = req.params.orderCode
    const order = await Order.findOne({ orderCode })
      .populate("customerCode")
      .populate("payment")
      .populate("items.itemCode")
    return res.send({ order })
  } catch (err) {
    return res.status(400).send({ error: "Search failed, try again" })
  }
})
//Ajusta campos de custo
router.post("/", async (req, res) => {
  try {
    const { orderCode, payment, items } = req.body
    const { itemCode } = items
    const findOrder = await Order.findOne({ orderCode })
    const findPayment = await Payment.findOne({ payment })
    const findProduct = await Product.findOne({ itemCode })
    if (findOrder) {
      return res.status(400).send({ error: "Order already exist" })
    }
    if (!findPayment) {
      return res.status(400).send({ error: "Payment not exist" })
    }
    if (!findProduct) {
      return res.status(400).send({ error: `Product ${itemCode} not exist` })
    }

    //validações e ajustes de gravação
    const { price, cost, stock, itemCode } = findProduct
    const { paymentTax } = findPayment
    req.body.docTotal = 0
    req.body.docTotal += paymentTax

    //grava
    const order = await Order.create(req.body)
    return res.send({ order })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" + err })
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
//Ajustar baixa de estoque
router.delete("/:orderCode", async (req, res) => {
  try {
    const orderCode = req.params.orderCode
    const findOrder = await Order.findOne({ orderCode })
    if (!findOrder) {
      return res.status(400).send({ error: "Order not exist" })
    }

    const deleteOrder = await Order.findOneAndDelete({ orderCode })
    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" })
  }
})

module.exports = (app) => app.use("/order", router)
