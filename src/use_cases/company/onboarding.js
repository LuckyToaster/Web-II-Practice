const { ValidationError } = require('../../infra/errors')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { companyDAO, userDAO } = require('../../dao/')
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
    const data = await companyDAO.get(company)
    if (data) await companyDAO.delete(company)

    company.setAddress(address).setPostalCode(postalCode).setCity(city).setProvince(province)

    if (user.nif === company.cif)
        company.setCif(user.nif).setName(user.name)
    else company.setCif(cif).setName(name)

    await companyDAO.insert(company)
    company = await companyDAO.get(company)

    user.setCompanyId(company.id)

    await userDAO.update(user)
}


module.exports = onboarding

