const express = require('express')
const mongoose = require("mongoose")
const app = express()
const cors = require('cors')
const { info, error } = require("./utils/logger")
const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controller/blogs')

info('connecting ...', MONGODB_URI)
mongoose.connect(MONGODB_URI)
    .then(res => info("connected to MongoDB"))
    .catch((err) => error(err.message))

app.use(cors())
app.use(express.json())
app.use("/Blog/publications", blogsRouter)

module.exports = app