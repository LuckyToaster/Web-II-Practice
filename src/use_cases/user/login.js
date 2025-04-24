const { getUserByEmail } = require('./helpers')
const { ValidationError } = require('../../infra/errors')


async function login(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = await getUserByEmail(req.body.email)
    user.login(req.body.password)

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
