const { userDAO } = require('../../dao')
const { 
    InternalServerError, 
    ValidationError,
} = require('../../infra/errors')
const { getUserByEmail } = require('./helpers')


async function passwordReset(req) {
    if (!req.body.code) throw new ValidationError('Request body does not contain a "code" field')
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = await getUserByEmail(req.body.email)

    try {
        user.resetPassword(req.body.code, req.body.password)
    } catch(e) {
        throw e
    } finally {
        await userDAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    }
}


module.exports = passwordReset
