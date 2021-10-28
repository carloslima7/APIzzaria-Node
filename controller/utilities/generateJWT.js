const jwt = require("jsonwebtoken")
const config = require("../../config/configuration")

module.exports = (params = {}) => {
  return jwt.sign(params, config.secret, { expiresIn: 300 })
}
