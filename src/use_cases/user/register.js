const { ValidationError, ConflictError } = require('../../infra/errors')
const emailService = require('../../infra/email')
const { userDAO } = require('../../dao')
const User = require('../../entities/user')


async function register(reqBody) {
    const { email, password } = reqBody
    if (!email) throw new ValidationError('Request body does not contain "email" field')
    if (!password) throw new ValidationError('Request body does not contain "password" field')

    let user = await userDAO.get(new User({ email }))

    if (user && user.isValidated())
        throw new ConflictError('Cannot attempt registration with an already validated email')

    if (!user) {
        user = User.create(email, password)
        await userDAO.insert(user)
        user = await userDAO.get(user)
    }

    const msg = `Your validation code is: ${user.code}`
    const err = 'Are you in "testing" or "production"? Please set MODE environment variable to either one of those'

    if (process.env.MODE === 'testing') emailService.sendMockEmail(user.email, msg)    
    else if (process.env.MODE === 'production') emailService.sendEmail(user.email, msg)
    else throw new UseCaseError(err)

    return { 
        token: user.getJwt(), 
        user: { 
            email: user.email, 
            status: user.status, 
            role: user.role, 
            id: user.id 
        }
    }
}


module.exports = register
