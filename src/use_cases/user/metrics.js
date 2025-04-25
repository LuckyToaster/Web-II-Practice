const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError } = require('../../infra/errors')
const { userDAO, companyDAO } = require('../../dao')
const User = require('../../entities/user')
const Company = require('../../entities/company')


async function metrics() {
    let users = await userDAO.getAll()
    let companies = await companyDAO.getAll()

    users = users.map(u => new User(u))
    companies = companies.map(c => new Company(c))

    const activeUsers = users.filter(u => !u.isDeleted() && u.isValidated())

    const numDeletedUsers = users.filter(u => u.isDeleted()).length // deleted could be null
    const numActiveUsers = activeUsers.length
    const numInactiveUsers = users.filter(u => u.isUnvalidated()).length

    const activeUserCompIds = activeUsers.map(u => u.companyId)

    const numActivePersonalUsers = activeUsers.filter(u => companies.u.
    const numActiveCompanyUsers = 

    //const numActivePersonalUsers = companies.reduce((acc, c) => activeUserCompIds.includes(c.cif)? acc + 1 : acc + 0, 0)
    //const numActiveCompanyUsers = companies.reduce((acc, c) => 

    //const numActiveCompanyUsers = users.filter(u => u.nif === await dataDAO.get(u.companyId).cif).length

}


module.exports = metrics
