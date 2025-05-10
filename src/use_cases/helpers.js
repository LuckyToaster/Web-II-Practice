const { UnauthorizedError } = require('../infra/errors')


function getTokenFromAuthHeader(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new UnauthorizedError('Request does not contain an "Authorization" header')

    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('Request header does not contain an authorization token')

    return token
}


module.exports = { getTokenFromAuthHeader, verifyJwt }
