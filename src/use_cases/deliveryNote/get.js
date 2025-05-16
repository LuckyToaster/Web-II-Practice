const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { projectDAO, deliveryNoteDAO, clientDAO, userDAO } = require('../../dao')


async function get(req) {
    if (!req.params.id) throw new ValidationError(`Request does not contain an ':id' parameter`)

    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const deliveryNote =  await projectDAO.get({ id: req.params.id })

    const result = { deliveryNote }
    if (deliveryNote.userId) result.user = await userDAO.get({ id: deliveryNote.userId })
    if (deliveryNote.clientId) result.client = await clientDAO.get({ id: deliveryNote.clientId })
    if (deliveryNote.projectId) result.project = await projectDAO.get({ id: deliveryNote.projectId })

    return result
}


module.exports = get
