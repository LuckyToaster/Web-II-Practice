const { clientDAO, userDAO } = require('../../dao')
const { getTokenFromAuthHeader } = require('../helpers')
const User = require('../../entities/client')


async function getAll(req) {
    const token = getTokenFromAuthHeader(req)
    const user = User.verifyJwt(token)
    await userDAO.get(user)
    return await clientDAO.getAll()
}


module.exports = getAll

