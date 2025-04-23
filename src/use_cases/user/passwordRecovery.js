const DAO = require('../../dao/user')
const EMAIL_SERVICE = require('../../infra/email')
const { 
    InternalServerError, 
    ValidationError, 
    UnauthorizedError,
    UseCaseError
} = require('../../infra/errors')
const { getUserByEmail } = require('./helpers')


async function passwordRecovery(req) {
    if (!req.body.email) 
        throw new ValidationError('Request body does not contain an "email" field')

    const user = await getUserByEmail(req.body.email)

    const minutesPassed = await DAO.getMetadata(user)
        .then(r => (new Date() - newDate(r.updatedAt)) / 60000)
        .catch(e => { throw new InternalServerError(e.message) })

    if (minutesPassed < 1) 
        throw new UnauthorizedError(`There is a one minute cooldown for password recovery, ${(1 - minutesPassed)} minutes remaining`)

    user.recoverPassword()
    await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    const msg = `Your password recovery code is: ${user.code}`

    if (this.env.MODE === 'testing') EMAIL_SERVICE.sendMockEmail(user.email, msg)        
    else if (this.env.MODE === 'production') EMAIL_SERVICE.sendEmail(user.email, msg)
    else throw new UseCaseError('Are you in "testing" or "production"? Please set MODE environment variable to either one of those')
}


module.exports = passwordRecovery
