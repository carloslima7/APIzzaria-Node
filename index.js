const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./controller/athentication')(app)

app.listen(3000, () => console.log('Online'))