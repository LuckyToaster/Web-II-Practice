const { getTokenFromAuthHeader } = require('../helpers')
const { getUserByJwt } = require('../user/helpers')
const { ValidationError } = require('../../infra/errors')
const { clientDAO } = require('../../dao')


async function remove(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
   
    const soft = req.body.soft
    if (!req.params.id) throw new ValidationError(`Request does not contains an ':id' parameter`)
    if (soft === null || soft === undefined) throw new ValidationError(`Request body does not contains a 'soft' field`)

    const client = await clientDAO.get({ ...req.pararms.id })
    if (!client) throw new NotFoundError(`Client with id: ${req.params.id} not found`)

    if (!soft) await clientDAO.delete({ ...req.params.id })
    else {
        client.deleted = true
        await clientDAO.update(client)
    }
}


module.exports = remove
