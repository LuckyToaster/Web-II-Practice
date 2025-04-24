const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError } = require('../../infra/errors')
const { userDAO } = require('../../dao')

async function deleteByJwt(req) {
    if (req.body.soft == null) 
        throw new ValidationError('Request body does not contain a "soft" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token) 

    if (req.body.soft) {
        user.softDelete()
        await userDAO.update(user)
    } else await userDAO.delete(user)
}

module.exports = deleteByJwt
