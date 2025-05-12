const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { projectDAO, clientDAO } = require('../../dao')
const Project = require('../../entities/project')


async function create(req) {
    const token = getTokenFromAuthHeader(req)
    const user = getUserByJwt(token)

    const clientId = req.body.clientId
    if (!clientId) throw new ValidationError(`Request body must contain either a 'clientId'`)

    const client = await clientDAO.get({ id: clientId })
    if (!client) throw new NotFoundError(`Client with id: ${clientId} not found`)

    const project = new Project({ userId: user.id, ...req.body }).generateCode()
    await projectDAO.insert(project)
    return project.masked()
}


module.exports = create
