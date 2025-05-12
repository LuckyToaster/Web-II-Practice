const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { projectDAO } = require('../../dao')


async function getAll(req) {
    const token = getTokenFromAuthHeader(req) 
    await getUserByJwt(token)
    return await projectDAO.getAll().then(ps => ps.map(p => p.masked()))
}


module.exports = getAll
