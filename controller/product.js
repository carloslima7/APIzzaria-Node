const express = require("express")
const router = express.Router()
const authenticatedMiddleware = require("../middleware/authenticated")
const Product = require("../model/product")

router.use(authenticatedMiddleware)

router.get("/:limit/:page", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit, 10)
    const page = parseInt(req.params.page, 10)
    const numberOfProducts = await Product.find().count()
    const factor = Math.ceil(numberOfProducts / limit)
    const skip = limit * (page - 1)

    if (page > factor || page < 1) {
      return res.status(400).send({ error: "Page not exist" })
    }

    const products = await Product.find({})
      .populate("createUser")
      .sort({ itemCode: 1 })
      .skip(skip)
      .limit(limit)

    return res.send({ products, pages: factor, totalRecords: numberOfProducts })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" })
  }
})

router.get("/:itemCode", async (req, res) => {
  try {
    const itemCode = req.params.itemCode
    const product = await Product.findOne({ itemCode })
      .populate("feedStock")
      .populate("createUser")
    return res.send({ product })
  } catch (err) {
    return res.status(400).send({ error: "Search failed, try again" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { itemCode } = req.body
    const findProduct = await Product.findOne({ itemCode })

    if (findProduct) {
      return res.status(400).send({ error: "Product already exists" })
    }
    const product = await Product.create({
      ...req.body,
      createUser: req.userId,
    })
    return res.send({ product })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" })
  }
})

router.put("/:itemCode", async (req, res) => {
  try {
    const { itemName, price, cost, stock, feedStock } = req.body
    const itemCode = req.params.itemCode
    const findProduct = await Product.findOne({ itemCode })
    if (!findProduct) {
      return res.status(400).send({ error: "Product not exist" })
    }
    const product = await Product.findOneAndUpdate(
      { itemCode },
      { itemName, price, cost, stock, feedStock },
      { new: true }
    )
    return res.send({ product })
  } catch (err) {
    return res.status(400).send({ error: "Update failed, try again" })
  }
})

router.delete("/:itemCode", async (req, res) => {
  try {
    const itemCode = req.params.itemCode
    const findProduct = await Product.findOne({ itemCode })
    if (!findProduct) {
      return res.status(400).send({ error: "Product not exist" })
    }

    const deleteProduct = await Product.findOneAndDelete({ itemCode })
    return res.send({ message: "Register deleted" })
  } catch (err) {
    return res.status(400).send({ error: "Delete failed, try again" })
  }
})

module.exports = (app) => app.use("/product", router)
