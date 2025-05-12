const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { clientDAO } = require('../../dao')


async function getAll(req) {
    const token = getTokenFromAuthHeader(req)
    await getUserByJwt(token)
    return await clientDAO.getAll()
}


module.exports = getAll

