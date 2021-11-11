const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/APIzzaria")
mongoose.Promise = global.Promise

module.exports = mongoose
