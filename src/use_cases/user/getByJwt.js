const DAO = require('../../dao/user')
const { getUserByJwt, getTokenFromAuthHeader } = require('./helpers')

async function getByJwt(req) {
    const token = await getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    return user.masked()
}

module.exports = getByJwt
