const { getUserByEmail } = require('./helpers')
const { UnauthorizedError, ValidationError } = require('../../infra/errors')


async function login(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = getUserByEmail(req.body.email)

    if (user.isUnvalidated()) throw new UnauthorizedError('User is not yet validated')
    if (!user.login(req.body.password)) throw new UnauthorizedError('Password is incorrect')

    return {
        token: user.getJwt(), 
        user: { 
            email: user.email, 
            role: user.role, 
            id: user.id, 
            name: user.name 
        }
    }
}


module.exports = login
