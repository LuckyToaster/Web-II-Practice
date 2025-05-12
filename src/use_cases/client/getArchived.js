const { clientDAO } = require('../../dao')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')


async function getArchived(req) {
    const token = getTokenFromAuthHeader(req)
    await getUserByJwt(token)
    return await clientDAO.get({ deleted: true })
}


module.exports = getArchived
