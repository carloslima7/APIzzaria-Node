const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/cfg')

const generateJWT = (params = {}) => {
    return jwt.sign(params, config.secret, { expiresIn: 300 })
}

router.post('/register', async (req, res) => {
    const { login } = req.body

    try {

        if (await User.findOne({ login })) {
            return res.status(400).send({ error: 'Login Already exists' })
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({ user, token: generateJWT({ id: user.id }) })

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed - ' + err })
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

    res.send({ user, token: generateJWT({ id: user.id }) })
})

module.exports = app => app.use('/authentication', router)
