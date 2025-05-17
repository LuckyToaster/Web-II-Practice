const { ValidationError, NotFoundError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { deliveryNoteDAO } = require('../../dao')
const { SIGNATURES_PATH } = require('../../infra/constants')


async function sign(req) {
    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not contain an ':id' parameter`)
    if (!req.file) throw new ValidationError('Request does not contain an image file')

    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const deliveryNote = await deliveryNoteDAO.get({ id })
    if (!deliveryNote) NotFoundError(`Delivery Note with id: ${id} not found`)

    deliveryNote.setSignaturePath(SIGNATURES_PATH + '/' + req.file.filename)
    await deliveryNoteDAO.update(deliveryNote)    
}


module.exports = sign
