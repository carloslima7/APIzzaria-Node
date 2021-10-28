const bcrypt = require('bcrypt')

module.exports = (password) => {
    return bcrypt.hash(password, 10)
}

module.exports = (password, passwordTyped) => {
    return bcrypt.compare(password, passwordTyped)
}