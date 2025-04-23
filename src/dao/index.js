// tables must be created sequentially (in order)
const companyDAO = require('./company')
const userDAO = require('./user')

module.exports = { companyDAO, userDAO }
