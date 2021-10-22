const jwt = require('jsonwebtoken')
const config = require('../config/cfg')

module.exports = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).send({ error: 'No token provided' })
    }

    const parts = token.split(' ')

    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Token error' })
    }

    const [scheme, content] = parts

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted' })
    }

    jwt.verify(content, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' })

        req.userId = decoded.id
        return next()
    })

}