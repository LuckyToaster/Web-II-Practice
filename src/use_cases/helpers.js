const { NotFoundError, UnauthorizedError } = require('../infra/errors')
const User = require('../entities/user')
const { userDAO } = require('../dao')


function getTokenFromAuthHeader(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new UnauthorizedError('Request does not contain an "Authorization" header')

    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('Request header does not contain an authorization token')

    return token
}


async function getUserByJwt(token) {
    let user = User.verifyJwt(token)
    const err = `User with id: ${user.id}, email: ${user.email} not found. (it was probably deleted manually or after validation failed)`
    user = await userDAO.get(user)
    if (!user) throw new NotFoundError(err)
    return user
}


async function getUserByEmail(email) {
    const user = await userDAO.get(new User({ email }))
    if (!user) throw new NotFoundError(`User with email: ${email} does not exist`)
    return user
}


module.exports = { getTokenFromAuthHeader, getUserByJwt, getUserByEmail }
