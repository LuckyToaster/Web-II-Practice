const { ClientDAO } = require('../../dao')
const Client = require('../../entities/client')
const { NotFoundError } = require('../../infra/errors')


async function getClientByJwt(token) {
    const client = Client.verifyJwt(token)
    const data = await ClientDAO.get(client)
    const err = `Client with id: ${client.id}, cif: ${client.cif} not found. (it was probably deleted manually or after validation failed)`
    if (!data) throw new NotFoundError(err)
    return new Client(data)
}


module.exports = { getClientByJwt }
