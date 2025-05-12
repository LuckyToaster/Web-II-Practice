const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { projectDAO } = require('../../dao')


async function getArchived(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
    return await projectDAO.get({ deleted: true }).then(ps => ps.map(p => p.masked))
}


module.exports = getArchived
