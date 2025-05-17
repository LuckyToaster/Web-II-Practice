const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const DeliveryNote = require('../../entities/deliveryNote')
const { deliveryNoteDAO } = require('../../dao')

async function create(req) {
    const { userId, clientId, projectId, format, hours, begin, end, description} = req.body

    if (!userId && !clientId && !projectId)
        throw ValidationError(`Request body does not contain either a 'userId', 'clientId' or 'projectId' field`)

    if (!format || !hours || !begin || !end || !description)
        throw new ValidationError(`Request body must contain the following fields: 'format', 'hours', 'begin', 'end', 'description'`)

    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const deliveryNote = new DeliveryNote({ ...req.body })
    if (!deliveryNote.userId) deliveryNote.setUserId(user.id)
    await deliveryNoteDAO.insert(deliveryNote)
}


module.exports = create
