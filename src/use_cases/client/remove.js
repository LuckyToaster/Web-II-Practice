const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { clientDAO } = require('../../dao')
const { Client } = require('../../entities/client')


async function remove(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
   
    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not contains an ':id' parameter`)

    const soft = req.body.soft
    if (soft === null || soft === undefined) throw new ValidationError(`Request body does not contains a 'soft' field`)

    const data = await clientDAO.get({ id })
    if (!data) throw new NotFoundError(`Client with id: ${id} not found`)
    const client = new Client(data)

    if (!soft) await clientDAO.delete({ id })
    else {
        client.softDelete()
        await clientDAO.update(client)
    }
}


module.exports = remove
