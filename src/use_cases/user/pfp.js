const { userDAO } = require('../../dao')
const { getTokenFromAuthHeader, getUserByJwt } = require('../helpers')
const { ValidationError } = require('../../infra/errors')
const { UPLOADS_PATH } = require('../../infra/constants')


async function pfp(req) {
    if (!req.file) throw new ValidationError('Request does not contain an image file')

    const { mimetype, filename } = req.file
    const mimes = [ 'image/jpeg', 'image/png', 'image/webp' ]

    if (!mimes.includes(mimetype)) 
        res.status(415).send(`${mimetype} not supported (please give .pdf or .docx`)

    const token = await getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    user.setPfpUrl(UPLOADS_PATH + '/' + filename)
    await userDAO.update(user)    
}


module.exports = pfp
