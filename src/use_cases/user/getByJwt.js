const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')

async function getByJwt(req) {
    const token = await getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    return user.masked()
}

module.exports = getByJwt
