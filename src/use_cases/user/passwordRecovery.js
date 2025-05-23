const { ValidationError, UnauthorizedError, UseCaseError } = require('../../infra/errors')
const emailService = require('../../infra/email')
const { userDAO } = require('../../dao')
const { getUserByEmail } = require('../helpers')

const cooldownErr = (secs) => `There is a one minute cooldown for password recovery, ${(60 - secs).toFixed()} seconds remaining`


async function passwordRecovery(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')

    const user = await getUserByEmail(req.body.email)
    const secsPassed = (new Date() - new Date(user.updatedAt)) / 1000
    if (secsPassed < 60) throw new UnauthorizedError(cooldownErr(secsPassed))

    user.recoverPassword()
    await userDAO.update(user)
    const msg = `Your password recovery code is: ${user.code}`

    if (process.env.MODE === 'testing') emailService.sendMockEmail(user.email, msg)        
    else if (process.env.MODE === 'production') emailService.sendEmail(user.email, msg)
    else throw new UseCaseError('Are you in "testing" or "production"? Please set MODE environment variable to either one of those')
}


module.exports = passwordRecovery
