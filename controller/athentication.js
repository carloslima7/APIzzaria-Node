const express = require("express")
const router = express.Router()
const User = require("../model/user")
//const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
//const config = require('../config/cfg')
const crypto = require("crypto")
const encryption = require("./utilities/encryption")
const generateJWT = require("./utilities/generateJWT")

router.post("/register", async (req, res) => {
  const { login } = req.body

  try {
    if (await User.findOne({ login }, "-__v -expirationToken -forgotToken")) {
      return res.status(400).send({ error: "Login Already exists" })
    }

    req.body.password = await encryption.encrypt(req.body.password)

    const user = await User.create(req.body)

    user.password = undefined

    return res.send({ user, token: generateJWT({ id: user.id }) })
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" + err })
  }
})

router.post("/authenticate", async (req, res) => {
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

  res.send({ user, token: generateJWT({ id: user.id }) })
})

router.post("/forgotpassword", async (req, res) => {
  const { login } = req.body

  try {
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

    res.send({ Message: `Your reset key is ${key}` })
  } catch (err) {
    res.status(400).send({ error: "Error on forgot password, try again" })
  }
})

router.post("/resetpassword", async (req, res) => {
  const { login, key, password } = req.body

  try {
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
    res.send({ message: "Password changed" })
  } catch (err) {
    res.status(400).send({ error: "Cannot reset password, try again" })
  }
})

module.exports = (app) => app.use("/authentication", router)
