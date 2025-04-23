const DAO = require('../../dao/user')
const User = require('../../entities/user')
const { 
    InternalServerError, 
    ValidationError,
    ConflictError
} = require('../../infra/errors')


async function register(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain "password" field')

    const query = new User({ email: req.body.email })
    const data = await DAO.get(query).catch(e => { throw new InternalServerError(e.message) })

    let user = null
    if (data) {
        user = new User(data)
        if (user.isValidated()) 
            throw new ConflictError('Cannot attempt registration with an already validated email')
    } else {
        user = User.create(query.email, req.body.password)
        await DAO.insert(user).catch(e => { throw new InternalServerError(e.message) })
        user = new User(await DAO.get(user))
    }

    return {
        token: user.getJwt(),
        user: { 
            email: user.email, 
            role: user.role, 
            status: user.status, 
            id: user.id, 
            code: user.code 
        }
    }
}

module.exports = register
