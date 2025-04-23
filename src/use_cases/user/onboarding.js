const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError } = require('../../infra/errors')


async function onboarding(req) {
    const token = getTokenFromAuthHeader(req)
    const [name, surname, nif] = [ req.body.name, req.body.surname, req.body.nif ]

    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!surname) throw new ValidationError('Request body does not contain a "surname" field')
    if (!nif) throw new ValidationError('Request body does not contain a "nif" field')

    const user = getUserByJwt(token)

    // and then what?
}


module.exports = onboarding
