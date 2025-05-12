const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { clientDAO, companyDAO } = require('../../dao')
const Client = require('../../entities/client')


async function create(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    const cif = req.body.cif
    if (!cif) throw new ValidationError(`Request body does not contain a 'cif' field`)

    const c = new Client({ ...request.body, userId: user.id })

    const company = await companyDAO.get({ cif })
    if (company) c.setCompanyId(company.id)

    await clientDAO.insert(c) 
    return await clientDAO.get(c)
}


module.exports = create
