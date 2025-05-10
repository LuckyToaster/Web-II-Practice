// tables must be created sequentially (in order)

const companyDAO = require('./company')
const userDAO = require('./user')
const clientDAO = require('./client')

module.exports = { companyDAO, userDAO, clientDAO }
