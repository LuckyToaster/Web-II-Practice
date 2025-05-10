const { clientDAO } = require('../../dao')
const { getTokenFromAuthHeader } = require('../helpers')
const { getUserByJwt } = require('../user/helpers')


async function getArchived(req) {
    const token = getTokenFromAuthHeader(req)
    await getUserByJwt(token)
    return await clientDAO.get({ deleted: true })
}


module.exports = getArchived
