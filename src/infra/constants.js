const { join } = require('path')

const UPLOADS_PATH = join(process.cwd(), 'uploads')

module.exports = { UPLOADS_PATH }
