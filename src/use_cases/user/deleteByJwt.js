const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { InternalServerError } = require('../../infra/errors')
const DAO = require('../../dao/user')

async function deleteByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token) 
    await DAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
}

module.exports = deleteByJwt
