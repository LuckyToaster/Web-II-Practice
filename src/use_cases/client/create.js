const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader } = require('../helpers')
const { clientDAO, userDAO } = require('../../dao')
const Client = require('../../entities/client')
const User = require('../../entities/client')


async function create(req) {
    const token = getTokenFromAuthHeader(req)
    const user = User.verifyJwt(token)
    user = await userDAO.get(user)

    if (!req.body.cif) 
        throw new ValidationError(`Request body does not contain a 'cif' field`)

    const c = new Client({ ...request.body, userId: user.id })
    await clientDAO.insert(c) 

    return await clientDAO.get(c)
}


module.exports = create
