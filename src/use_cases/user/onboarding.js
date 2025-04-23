const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError, InternalServerError } = require('../../infra/errors')
const { userDAO } = require('../../dao')


async function onboarding(req) {
    const token = getTokenFromAuthHeader(req)
    const { name, surname, nif } = req.body // this is called 'object spread' i finally get to use it

    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!surname) throw new ValidationError('Request body does not contain a "surname" field')
    if (!nif) throw new ValidationError('Request body does not contain a "nif" field')

    const user = await getUserByJwt(token)
    user.setName(name)
    user.setSurname(surname)
    user.setNif(nif)
    await userDAO.update(user).catch(e => { throw new InternalServerError(e.message) })
}


module.exports = onboarding
