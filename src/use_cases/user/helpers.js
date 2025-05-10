const { userDAO } = require('../../dao')
const User = require('../../entities/user')
const { NotFoundError, UnauthorizedError } = require('../../infra/errors')

const { ValidationError, UnauthorizedError, UseCaseError } = require('../infra/errors')

function getTokenFromAuthHeader(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new UnauthorizedError('Request does not contain an "Authorization" header')

    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('Request header does not contain an authorization token')

    return token
}


async function getUserByJwt(token) {
    const user = User.verifyJwt(token)
    const data = await userDAO.get(user)
    const err = `User with id: ${user.id}, email: ${user.email} not found. (it was probably deleted manually or after validation failed)`
    if (!data) throw new NotFoundError(err)
    return new User(data)
}

async function getUserByEmail(email) {
    const user = new User({ email: email})
    const data = await userDAO.get(user)
    if (!data) throw new NotFoundError(`User with email: ${user.email} does not exist`)
    return new User(data)
}

module.exports = { getTokenFromAuthHeader, getUserByJwt, getUserByEmail }
