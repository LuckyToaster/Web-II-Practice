const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { InternalServerError } = require('../../infra/errors')
const { userDAO } = require('../../dao')

async function deleteByJwt(req) {
    if (!req.body.softDelete) throw new ValidationError('Request body does not contain a "softDelete" field')
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token) 
    if (req.body.softDelete) {
        user.softDelete()
        await userDAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    } else await userDAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
}

module.exports = deleteByJwt
