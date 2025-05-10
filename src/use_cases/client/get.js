const { clientDAO, userDAO } = require('../../dao')
const { getTokenFromAuthHeader } = require('../helpers')
const Client = require('../../entities/client')


async function get(req) {
    const token = getTokenFromAuthHeader(req)    
    const user = getUserByJwt(token)
    await userDAO.get(user)

    if (!req.params.id) 
        throw new ValidationError(`Request does not have an ':id' parameter`)

    return await clientDAO.get({...req.params.id})
}


module.exports = get
