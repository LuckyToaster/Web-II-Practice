const { userDAO } = require('../../dao')
const User = require('../../entities/user')
const { ValidationError, ConflictError } = require('../../infra/errors')


async function register(reqBody) {
    const { email, password } = reqBody
    if (!email) throw new ValidationError('Request body does not contain "email" field')
    if (!password) throw new ValidationError('Request body does not contain "password" field')

    let user = new User({ email })
    const data = await userDAO.get(user)

    if (data) {
        user = new User(data)
        const err = 'Cannot attempt registration with an already validated email'
        if (user.isValidated()) throw new ConflictError(err)
    } else {
        user = User.create(email, password)
        await userDAO.insert(user)
        user = new User(await userDAO.get(user))
    }

    return { token: user.getJwt(), user }
}


module.exports = register
