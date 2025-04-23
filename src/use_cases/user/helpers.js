const DAO = require('../../dao/user')
const User = require('../../entities/user')
const { 
    InternalServerError, 
    NotFoundError, 
    UnauthorizedError 
} = require('../../infra/errors')

function getTokenFromAuthHeader(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new UnauthorizedError('Request does not contain an "Authorization" header')
    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('Request header does not contain an authorization token')
    return token
}

async function getUserByJwt(token) {
    const user = User.verifyJwt(token)
    const data = await DAO.get(user).catch(e => { throw new InternalServerError(e.message) })
    const errStr = `User with id: ${user.id}, email: ${user.email} not found. (it was probably deleted manually or after validation failed)`
    if (!data) throw new NotFoundError(errStr)
    return new User(data)
}


async function getUserByEmail(email) {
    const user = new User({ email: email})
    const data = await DAO.get(user).catch(e => { throw new InternalServerError(e.message) })
    if (!data) throw new NotFoundError(`User with email: ${user.email} does not exist`)
    return new User(data)
}

module.exports = { getTokenFromAuthHeader, getUserByJwt, getUserByEmail }
