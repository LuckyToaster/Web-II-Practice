const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ConflictError } = require('../../infra/errors')
const { projectDAO } = require('../../dao')


async function remove(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
   
    const id = req.params.id
    if (!id) throw new ValidationError(`Request does not contains an ':id' parameter`)

    const soft = req.body.soft
    if (soft === null || soft === undefined) throw new ValidationError(`Request body does not contains a 'soft' field`)

    const project = await projectDAO.get({ id })
    if (!project) throw new ConflictError('Cannot delete non-existing Project')

    if (soft) await clientDAO.update(project.softDelete())
    else await projectDAO.delete({ id })
}


module.exports = remove

