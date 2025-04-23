const { companyDAO, userDAO } = require('../../dao/')
const { getTokenFromAuthHeader, getUserByJwt } = require('../user/helpers')
const { ValidationError, InternalServerError, ConflictError } = require('../../infra/errors')
const Company = require('../../entities/company')


async function onboarding(req) {
    const { name, cif, address, postalCode, city, province } = req.body 
    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!cif) throw new ValidationError('Request body does not contain a "cif" field')
    if (!address) throw new ValidationError('Request body does not contain an "address" field')
    if (!postalCode) throw new ValidationError('Request body does not contain a "postalCode" field')
    if (!city) throw new ValidationError('Request body does not contain a "city" field')
    if (!province) throw new ValidationError('Request body does not contain a "province" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    let company = new Company({ ...req.body })
    const data = await companyDAO.get(company).catch(e => { throw new InternalServerError(e.message) })
    if (data) throw new ConflictError('Company already exists')

    company.setAddress(address).setPostalCode(postalCode).setCity(city).setProvince(province)

    if (user.nif === company.cif)
        company.setCif(user.nif).setName(user.name)
    else company.setCif(cif).setName(name)

    await companyDAO.insert(company).catch(e => { throw new InternalServerError(e.message) })
    company = await companyDAO.get(company).catch(e => { throw new InternalServerError(e.message) })

    user.setCompanyId(company.id)
    await userDAO.update(user).catch(e => { throw new InternalServerError(e.message) })
}


module.exports = onboarding

