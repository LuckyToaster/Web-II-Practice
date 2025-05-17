const { join } = require('path')

const UPLOADS_PATH = join(process.cwd(), 'uploads')
const SIGNATURES_PATH = join(process.cwd(), 'signatures')

module.exports = { UPLOADS_PATH, SIGNATURES_PATH }
