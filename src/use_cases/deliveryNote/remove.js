const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ConflictError, ValidationError } = require('../../infra/errors')
const { deliveryNoteDAO } = require('../../dao')


async function remove(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
   
    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not contains an ':id' parameter`)

    const deliveryNote = await deliveryNoteDAO.get({ id })
    if (!deliveryNote) throw ConflictError('Cannot delete a non existing deliveryNote')

    if (deliveryNote.isSigned()) 
        await deliveryNoteDAO.delete(deliveryNote)
}


module.exports = remove
