const { userDAO, companyDAO } = require('../../dao')


async function metrics() {
    let users = await userDAO.getAll()
    let companies = await companyDAO.getAll()

    const activeUsers = users.filter(u => !u.isDeleted() && u.isValidated())
    const numDeletedUsers = users.filter(u => u.isDeleted()).length
    const numActiveUsers = activeUsers.length
    const numInactiveUsers = users.filter(u => u.isUnvalidated()).length
    const activeUserNifs = activeUsers.map(u => u.nif)
    const numActivePersonalUsers = companies.reduce((acc, c) => activeUserNifs.includes(c.cif)? acc + 1 : acc + 0, 0)
    const numActiveCompanyUsers = companies.reduce((acc, c) => !activeUserNifs.includes(c.cif)? acc + 1 : acc + 0, 0)

    return { numActiveUsers, numDeletedUsers, numInactiveUsers, numActiveCompanyUsers, numActivePersonalUsers }
}


module.exports = metrics
