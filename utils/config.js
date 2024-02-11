require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = 'mongodb://127.0.0.1:27017'

module.exports = { PORT, MONGODB_URI }