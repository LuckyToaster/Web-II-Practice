const { clientDAO } = require('../../dao')
const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader } = require('../helpers')
const { getUserByJwt } = require('../user/helpers')


async function get(req) {
    const token = getTokenFromAuthHeader(req)    
    await getUserByJwt(token)

    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not have an ':id' parameter`)

    return await clientDAO.get({ id })
}


module.exports = get
