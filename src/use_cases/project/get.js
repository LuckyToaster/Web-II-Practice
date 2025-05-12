const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { projectDAO } = require('../../dao')


async function get(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const id = req.params.id
    if (!id) throw new ValidationError(`Request expects an ':id' parameter`)

    return await projectDAO.get({ id }).then(p => p.masked())
}


module.exports = get
