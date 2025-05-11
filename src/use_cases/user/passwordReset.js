const { ValidationError } = require('../../infra/errors')
const { getUserByEmail } = require('../helpers')
const { userDAO } = require('../../dao')


async function passwordReset(req) {
    const { email, code, password } = req.body
    if (!code) throw new ValidationError('Request body does not contain a "code" field')
    if (!email) throw new ValidationError('Request body does not contain an "email" field')
    if (!password) throw new ValidationError('Request body does not contain a "password" field')

    const user = await getUserByEmail(email)

    try {
        user.resetPassword(code, password)
    } catch(e) {
        throw e
    } finally {
        await userDAO.update(user)
    }
}


module.exports = passwordReset
