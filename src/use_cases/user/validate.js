const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt  } = require('../helpers')
const { userDAO } = require('../../dao')


async function validate(req) {
    if (!req.body.code) 
        throw new ValidationError('Request body does not contain a "code" field')

    const token = getTokenFromAuthHeader(req)
    let user = await getUserByJwt(token)

    let valError = null
    try {
        user.validate(req.body.code)
    } catch (e) {
        valError = e
        if (!user.hasAttempts()) await userDAO.delete(user)
    }

    await userDAO.update(user)
    if (valError) throw valError
}


module.exports = validate
