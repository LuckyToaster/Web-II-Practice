const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { clientDAO } = require('../../dao')
const Client = require('../../entities/client')


async function update(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const id = req.params.id 
    if (!id) throw new ValidationError(`Request does not contains an ':id' parameter`)

    const client = await clientDAO.get({ id })
    if (!client) throw new NotFoundError('Client with id: ${req.params.id} could not be found')

    client = new Client({ ...req.body, id })
    await clientDAO.update(client)

    return clientDAO.get(client)
}


module.exports = update
