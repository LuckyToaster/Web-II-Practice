const { userDAO } = require('../../dao')
const { InternalServerError, ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')


async function validate(req) {
    if (!req.body.code) 
        throw new ValidationError('Request body does not contain a "code" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    try {
        user.validate(req.body.code)
    } catch (validationError) {
        if (!user.hasAttempts())
            await userDAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
        throw validationError
    } finally {
        await userDAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    }
}


module.exports = validate
