const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/cfg')
const crypto = require('crypto')

const generateJWT = (params = {}) => {
    return jwt.sign(params, config.secret, { expiresIn: 300 })
}

const encryption = (password) => {
    return bcrypt.hash(password, 10)
}

router.post('/register', async (req, res) => {
    const { login } = req.body

    try {

        if (await User.findOne({ login })) {
            return res.status(400).send({ error: 'Login Already exists' })
        }

        req.body.password = await encryption(req.body.password) //await bcrypt.hash(req.body.password, 10)

        const user = await User.create(req.body)

        user.password = undefined
        user.expirationToken = undefined
        user.__v = undefined

        return res.send({ user, token: generateJWT({ id: user.id }) })

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})


router.post('/authenticate', async (req, res) => {
    const { login, password } = req.body

    const user = await User.findOne({ login }).select('+password')

    if (!user) {
        return res.status(400).send({ error: 'Login not found' })
    }

    if (! await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invelid password' })
    }

    user.password = undefined
    user.__v = undefined
    user.expirationToken = undefined


    res.send({ user, token: generateJWT({ id: user.id }) })
})

router.post('/forgotpassword', async (req, res) => {
    const { login } = req.body

    try {
        const user = await User.findOne({ login })
        if (!user) {
            return res.status(400).send({ error: 'User not found' })
        }

        const key = crypto.randomBytes(20).toString('hex')
        const validity = new Date()
        validity.setHours(validity.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': { forgotToken: key, expirationToken: validity }
        })

        res.send({ Message: `Your reset key is ${key}` })

    } catch (err) {
        res.status(400).send({ error: 'Error on forgot password, try again' })
    }

})

router.post('/resetpassword', async (req, res) => {
    const { login, key, password } = req.body

    try {
        const user = await User.findOne({ login })
            .select('+forgotToken expirationtoken')


        if (!user) {
            return res.status(400).send({ error: 'User not found' })
        }
        if (key !== user.forgotToken) {
            return res.status(400).send({ error: 'Key invalid, varify the key or generate a new key again' })
        }

        const now = new Date()
        if (now > user.expirationToken) {
            return res.status(400).send({ error: 'Key expired, generate a new key again' })
        }

        user.password = await encryption(password)
        user.forgotToken = undefined

        await user.save()
        res.send({ message: 'Password changed' })

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again' + err })
    }



})


module.exports = app => app.use('/authentication', router)
