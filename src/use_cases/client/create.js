const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader } = require('../helpers')
const { getUserByJwt } = require('../user/helpers')
const { clientDAO } = require('../../dao')
const Client = require('../../entities/client')


async function create(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    if (!req.body.cif) 
        throw new ValidationError(`Request body does not contain a 'cif' field`)

    const c = new Client({ ...request.body, userId: user.id })
    await clientDAO.insert(c) 

    return await clientDAO.get(c)
}


module.exports = create
