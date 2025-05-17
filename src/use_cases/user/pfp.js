const { userDAO } = require('../../dao')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { UPLOADS_PATH } = require('../../infra/constants')


async function pfp(req) {
    if (!req.file) throw new ValidationError('Request does not contain an image file')
    const token = await getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    user.setPfpUrl(UPLOADS_PATH + '/' + req.file.filename)
    await userDAO.update(user)    
}


module.exports = pfp
