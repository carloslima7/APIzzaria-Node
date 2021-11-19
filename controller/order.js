const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const Order = require("../model/order")
const Payment = require("../model/payment")
const Product = require("../model/product")
const CashFlow = require("../model/cashflow")

router.use(authenticatedMiddleware)

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

router.post("/", async (req, res) => {
  try {
    const { orderCode, payment, items, deliveryTax } = req.body
    const findOrder = await Order.findOne({ orderCode })
    const findPayment = await Payment.findOne({ payment })

    if (findOrder) {
      return res.status(400).send({ error: "Order already exist" })
    }
    if (!findPayment) {
      return res.status(400).send({ error: "Payment not exist" })
    }

    let countItems = 0
    let totalItens = 0
    for (let itemsArray of items) {
      const id = itemsArray.itemCode
      const quantity = itemsArray.quantity
      const findProduct = await Product.findOne({ id }).select(
        "price cost stock"
      )
      const stock = findProduct.stock - quantity
      const updateStock = await Product.findOneAndUpdate(
        { id },
        { stock },
        { new: true }
      )
      req.body.items[countItems].priceOrder = findProduct.price
      req.body.items[countItems].costOrder = findProduct.cost
      req.body.items[countItems].priceTotal = quantity * findProduct.price
      totalItens += quantity * findProduct.price - quantity * findProduct.cost
      countItems++
    }

    const { paymentTax } = findPayment
    req.body.totalItens = totalItens
    req.body.docTotal = totalItens + paymentTax + deliveryTax

    const order = await Order.create(req.body)
    return res.send({ order })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" + err })
  }
})

router.put("/:orderCode", async (req, res) => {
  try {
    const orderCode = req.params.orderCode
    const { finished } = req.body
    const validOrder = await Order.find({ orderCode, finished: "S" })
    if (validOrder) {
      return res.status(400).send({ error: "Order already finished" })
    }

    const finishOrder = await Order.findOneAndUpdate(
      { orderCode },
      { finished },
      { new: true }
    )

    if (finishOrder) {
      const docTotal = finishOrder.docTotal
      let lucroTotal = docTotal
      const today = new Date()
      const date = `${today.getFullYear()}${
        today.getMonth() + 1
      }${today.getDate()}`

      const findFlow = await CashFlow.findOne({ date })
      if (findFlow) {
        lucroTotal += findFlow.lucroTotal
      }

      const cashflow = await CashFlow.updateOne(
        { date },
        { $push: { orders: { orderCode, docTotal } }, lucroTotal, date },
        { upsert: true }
      )
    }

    return res.send({ message: `Order ${orderCode} finished` })
  } catch (err) {
    return res.status(400).send({ error: "Update failed, try again" + err })
  }
})

router.delete("/:orderCode", async (req, res) => {
  try {
    const orderCode = req.params.orderCode
    const findOrder = await Order.findOne({ orderCode })
    if (!findOrder) {
      return res.status(400).send({ error: "Order not exist" })
    }
    if (findOrder.finished !== "N") {
      return res.status(400).send({ error: "Order finished cannot be deleted" })
    }

    for (items of findOrder.items) {
      const { itemCode, quantity } = items
      const findItem = await Product.findOne({ id: itemCode }).select("stock")
      const stock = findItem.stock + quantity
      const lowStock = await Product.findOneAndUpdate(
        { id: itemCode },
        { stock },
        { new: true }
      )
    }

    const deleteOrder = await Order.findOneAndDelete({ orderCode })

    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" + err })
  }
})

module.exports = (app) => app.use("/order", router)
