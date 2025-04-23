const DAO = require('../../dao/user')
const { 
    InternalServerError, 
    ValidationError,
    UnauthorizedError
} = require('../../infra/errors')
const { getUserByEmail } = require('./helpers')


async function passwordReset(req) {
    if (!req.body.code) throw new ValidationError('Request body does not contain a "code" field')
    if (!req.body.emaill) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = getUserByEmail(req.body.email)

    if (!user.hasAttempts()) 
        throw new UnauthorizedError('No attempts left, please make a new password recovery request')

    user.resetPassword(req.body.code, req.body.password)
    await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
}


module.exports = passwordReset
