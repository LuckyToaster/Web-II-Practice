const { userDAO } = require('../../dao')
const { getTokenFromAuthHeader, getUserByJwt } = require('./helpers')
const { ValidationError } = require('../../infra/errors')

async function pfp(req) {
    if (!req.file) throw new ValidationError('Request does not contain an image file')
    const token = await getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    
    console.log(req.file.filename)
    console.log(req.file.mimetype)
    //user.setPfpUrl(req.filename)
}

module.exports = pfp
