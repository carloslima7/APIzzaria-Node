const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    const { login } = req.body

    try {

        if (await User.findOne({ login })) {
            return res.status(400).send({ error: 'Login Already exists' })
        }

        req.body.password =  await bcrypt.hash(req.body.password, 10)   

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({ user })
      
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed - ' + err })
    }
})

module.exports = app => app.use('/authentication', router)