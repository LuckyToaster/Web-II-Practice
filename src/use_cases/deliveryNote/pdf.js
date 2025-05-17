const { ValidationError, InternalServerError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { projectDAO, deliveryNoteDAO, clientDAO, userDAO } = require('../../dao')
const generatePDF = require('../../infra/pdf')


async function pdf(req) {
    if (!req.params.id) throw new ValidationError(`Request does not contain an ':id' parameter`)

    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const deliveryNote =  await deliveryNoteDAO.get({ id: req.params.id })
    const obj = { deliveryNote }
    if (deliveryNote.userId) obj.user = await userDAO.get({ id: deliveryNote.userId })
    if (deliveryNote.clientId) obj.client = await clientDAO.get({ id: deliveryNote.clientId })
    if (deliveryNote.projectId) obj.project = await projectDAO.get({ id: deliveryNote.projectId })

    const bufferData = await generatePDF(obj)
    if (!bufferData) throw new InternalServerError(`Couldn't generate pdf`)
    return bufferData
}


module.exports = pdf
