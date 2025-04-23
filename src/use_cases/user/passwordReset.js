const DAO = require('../../dao/user')
const { 
    InternalServerError, 
    ValidationError,
    UnauthorizedError
} = require('../../infra/errors')
const { getUserByEmail } = require('./helpers')


async function passwordReset(req) {
    if (!req.body.code) throw new ValidationError('Request body does not contain a "code" field')
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = await getUserByEmail(req.body.email)

    if (!user.hasAttempts()) 
        throw new UnauthorizedError('No attempts left, please make a new password recovery request')

    try {
        user.resetPassword(req.body.code, req.body.password)
    } catch(e) {
        throw e
    } finally {
        await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    }
}


module.exports = passwordReset
