const DAO = require('../../dao/user')
const { getUserByJwt } = require('./helpers')
const { InternalServerError } = require('../../infra/errors')


async function getByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    const metadata = await DAO.getMetadata(user).catch(e => { throw new InternalServerError(e.message) })
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        nif: user.nif,
        role: user.role,
        status: user.status,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
    }
}

module.exports = getByJwt
