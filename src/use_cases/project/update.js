const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { projectDAO } = require('../../dao')
const Project = require('../../entities/project')


async function update(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    const id = req.params.id
    if (!id) throw new ValidationError(`Request must contain an ':id' parameter`)

    const p = new Project(req.body).setId(id)
    await projectDAO.update(p)
    return p.masked()
}


module.exports = update

