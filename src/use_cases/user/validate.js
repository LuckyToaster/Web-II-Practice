const DAO = require('../../dao/user')
const { InternalServerError, ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')


async function validate(req) {
    if (!req.body.code) 
        throw new ValidationError('Request body does not contain a "code" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    if (!user.isUnvalidated()) 
        throw new ValidationError('User already validated')

    if (user.hasAttempts()) {
        try {
            user.validate(req.body.code) 
        } catch(e) {
            throw e
        } finally {
            await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
        }
    } else await DAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
}


module.exports = validate
