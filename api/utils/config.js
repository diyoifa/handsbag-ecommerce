require('dotenv').config()

const PORT = process.env.PORT
const JWT_SEC = process.env.JWT_SEC
let MONGODB_URI = process.env.MONGODB_URI
// let MONGODB_URI = process.env.TEST_MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SEC
}

