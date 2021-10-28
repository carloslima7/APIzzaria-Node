const bcrypt = require("bcrypt")

const encrypt = (password) => {
  return bcrypt.hash(password, 10)
}

const compare = (password, passwordTyped) => {
  return bcrypt.compare(password, passwordTyped)
}

module.exports = { encrypt, compare }
