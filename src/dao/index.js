// tables must be created sequentially (in order)

const companyDAO = require('./company')
const userDAO = require('./user')
const clientDAO = require('./client')
const projectDAO = require('./project')
const deliveryNoteDAO = require('./deliveryNote')

;(async () => {
    await companyDAO.createTableIfNotExists()
    await userDAO.createTableIfNotExists()
    await clientDAO.createTableIfNotExists()
    await projectDAO.createTableIfNotExists()
    await deliveryNoteDAO.createTableIfNotExists()
})()


module.exports = { companyDAO, userDAO, clientDAO, projectDAO, deliveryNoteDAO }
