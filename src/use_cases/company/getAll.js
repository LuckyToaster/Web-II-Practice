const { ValidationError, InternalServerError } = require('../../infra/errors')
const { companyDAO } = require('../../dao/')

async function getAll() {
    return await companyDAO.getAll().catch(e => { throw new ValidationError(e.mesage) })
}

module.exports = getAll

