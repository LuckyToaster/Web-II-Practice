const { clientDAO, userDAO } = require('../../dao')
const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader } = require('../helpers')
const { getUserByJwt } = require('../user/helpers')


async function get(req) {
    const token = getTokenFromAuthHeader(req)    
    const user = getUserByJwt(token)
    await userDAO.get(user)

    if (!req.params.id) 
        throw new ValidationError(`Request does not have an ':id' parameter`)

    return await clientDAO.get({...req.params.id})
}


module.exports = get
