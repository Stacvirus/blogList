const app = require('./app')
const {info, error} = require('./utils/logger')
const {PORT} = require('./utils/config')

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})