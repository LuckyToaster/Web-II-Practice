const { clientDAO } = require('../../dao')
const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt, getProjects, getDeliveryNotes } = require('../helpers')


async function get(req) {
    const token = getTokenFromAuthHeader(req)    
    await getUserByJwt(token)

    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not have an ':id' parameter`)

    const client = await clientDAO.get({ id })
    if (!client) throw new NotFoundError(`Client with id: ${id} not found`)
    const clientId = client.id

    const activeProjects = await getProjects({ clientId }).then(ps => ps.filter(p => p.isActive()))
    const pendingDeliveryNotes = await getDeliveryNotes({ clientId }).then(dns => dns.filter(d => d.isPending()))

    return { client, activeProjects, pendingDeliveryNotes }
}

module.exports = get
