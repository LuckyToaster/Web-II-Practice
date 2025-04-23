const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { InternalServerError } = require('../../infra/errors')
const DAO = require('../../dao/user')

async function deleteByJwt(req) {
    if (!req.body.softDelete) throw new ValidationError('Request body does not contain a "softDelete" field')
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token) 
    if (req.body.softDelete) {
        user.softDelete()
        await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    } else await DAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
}

module.exports = deleteByJwt
