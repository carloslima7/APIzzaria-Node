const mongoose = require("mongoose")
const configureConnection = require("../config/configuration")

mongoose.connect(
  `mongodb://${configureConnection.server}/${configureConnection.base}`
)
mongoose.Promise = global.Promise

module.exports = mongoose
