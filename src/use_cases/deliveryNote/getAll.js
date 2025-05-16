const { NotFoundError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { deliveryNoteDAO } = require('../../dao')


async function getAll(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)

    const deliveryNotes =  await deliveryNoteDAO.getAll()
    if (!deliveryNotes) throw NotFoundError(`Couldn't get any delivery notes`)

    return deliveryNotes
}


module.exports = getAll
