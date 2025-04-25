const { join } = require('path')

const UPLOADS_PATH = join(process.cwd(), 'uploads')

console.log(UPLOADS_PATH)
console.log(typeof UPLOADS_PATH)

module.exports = { UPLOADS_PATH }
