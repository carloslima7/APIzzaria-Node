const express = require("express")
const router = express.Router()
const User = require("../model/user")
const crypto = require("crypto")
const encryption = require("./utilities/encryption")
const generateJWT = require("./utilities/generateJWT")

router.post("/register", async (req, res) => {
  try {
    const { login } = req.body
    if (await User.findOne({ login }, "-__v -expirationToken -forgotToken")) {
      return res.status(400).send({ error: "Login Already exists" })
    }

    req.body.password = await encryption.encrypt(req.body.password)

    const user = await User.create(req.body)

    user.password = undefined

    return res.send({ user, token: generateJWT({ id: user.id }) })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" })
  }
})

router.post("/authenticate", async (req, res) => {
  try {
    const { login, password } = req.body

    const user = await User.findOne(
      { login },
      "-__v -expirationToken -forgotToken"
    ).select("+password")

    if (!user) {
      return res.status(400).send({ error: "Login not found" })
    }

    if (!(await encryption.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid password" })
    }

    user.password = undefined

    return res.send({ user, token: generateJWT({ id: user.id }) })
  } catch (err) {
    return res.status(401).send({ error: "Authentication failed, try again" })
  }
})

router.post("/forgotpassword", async (req, res) => {
  try {
    const { login } = req.body
    const user = await User.findOne({ login })
    if (!user) {
      return res.status(400).send({ error: "User not found" })
    }

    const key = crypto.randomBytes(20).toString("hex")
    const validity = new Date()
    validity.setHours(validity.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: { forgotToken: key, expirationToken: validity },
    })

    return res.send({ Message: `Your reset key is ${key}` })
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Error on forgot password, try again" })
  }
})

router.post("/resetpassword", async (req, res) => {
  try {
    const { login, key, password } = req.body
    const user = await User.findOne({ login }).select(
      "+forgotToken expirationtoken"
    )

    if (!user) {
      return res.status(400).send({ error: "User not found" })
    }
    if (key !== user.forgotToken) {
      return res.status(400).send({
        error: "Key invalid, varify the key or generate a new key again",
      })
    }

    const now = new Date()
    if (now > user.expirationToken) {
      return res
        .status(400)
        .send({ error: "Key expired, generate a new key again" })
    }

    user.password = await encryption.encrypt(password)
    user.forgotToken = undefined

    await user.save()
    return res.send({ message: "Password changed" })
  } catch (err) {
    return res.status(400).send({ error: "Cannot reset password, try again" })
  }
})

router.get("/:limit/:page", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit, 10)
    const page = parseInt(req.params.page, 10)
    const numberOfUsers = await User.find().count()
    const factor = Math.ceil(numberOfUsers / limit)
    const skip = limit * (page - 1)

    if (page > factor || page < 1) {
      return res.status(400).send({ error: "Page not exist" })
    }

    const users = await User.find({}, "-__v -expirationToken -forgotToken")
      .sort({ login: 1 })
      .skip(skip)
      .limit(limit)

    return res.send({
      users,
      pages: factor,
      totalRecords: numberOfUsers,
    })
  } catch (err) {
    return res.status(400).send({ error: "Search Failed, try again" })
  }
})

module.exports = (app) => app.use("/authentication", router)
