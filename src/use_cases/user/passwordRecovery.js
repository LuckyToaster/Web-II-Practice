const DAO = require('../../dao/user')
const EMAIL_SERVICE = require('../../infra/email')
const { 
    InternalServerError, 
    ValidationError, 
    UnauthorizedError,
    UseCaseError
} = require('../../infra/errors')
const { getUserByEmail } = require('./helpers')

const cooldownErr = (mins) => {
    const secs = ((1 - mins) * 60).toFixed(2)
    return `There is a one minute cooldown for password recovery, ${secs} minutes remaining`
}


async function passwordRecovery(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')

    const user = await getUserByEmail(req.body.email)
    const minsPassed = await DAO.getMetadata(user)
        .then(r => (new Date() - new Date(r.updatedAt)) / 60000)
        .catch(e => { throw new InternalServerError(e.message) })

    if (minsPassed < 1) throw new UnauthorizedError(cooldownErr(minsPassed))

    user.recoverPassword()
    await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    const msg = `Your password recovery code is: ${user.code}`

    if (process.env.MODE === 'testing') EMAIL_SERVICE.sendMockEmail(user.email, msg)        
    else if (process.env.MODE === 'production') EMAIL_SERVICE.sendEmail(user.email, msg)
    else throw new UseCaseError('Are you in "testing" or "production"? Please set MODE environment variable to either one of those')
}


module.exports = passwordRecovery
