const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/APIzzaria', { useMongoClient: true })
mongoose.Promise = global.Promise

module.exports = mongoose