const express = require('express')
const router = express.Router()
const middleware = require('../middleware/authenticated')

router.use(middleware)


router.get('/', (req, res) => {
    res.send({ user: req.userId })
})

module.exports = app => app.use('/payment', router)
