const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError } = require('../../infra/errors')
const { userDAO } = require('../../dao')


async function onboarding(req) {
    const token = getTokenFromAuthHeader(req)
    const { name, surname, nif } = req.body 

    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!surname) throw new ValidationError('Request body does not contain a "surname" field')
    if (!nif) throw new ValidationError('Request body does not contain a "nif" field')

    const user = await getUserByJwt(token)

    // uff, use builder pattern here
    user.setName(name)
    user.setSurname(surname)
    user.setNif(nif)
    await userDAO.update(user)
}


module.exports = onboarding
