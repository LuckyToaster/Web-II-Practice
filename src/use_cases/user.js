/*
const DAO = require('../dao/userDAO')
const User = require('../entities/user')
const { 
    InternalServerError, 
    ConflictError, 
    UnauthorizedError, 
    ValidationError 
} = require('../infra/errors')
*/


/*
async function register(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain "password" field')

    const query = new User({ email: req.body.email })
    const data = await DAO.get(query).catch(e => { throw new InternalServerError(e.message) })
    let user = null

    if (data) {
        user = new User(data)
        if (user.isValidated()) 
            throw new ConflictError('Cannot attempt registration with an already validated email')
    } else {
        user = User.create(query.email, req.body.password)
        await DAO.insert(user).catch(e => { throw new InternalServerError(e.message) })
        user = new User(await DAO.get(user))
    }

    return {
        token: user.getJwt(),
        user: { email: user.email, role: user.role, status: user.status, id: user.id, code: user.code }
    }
}
*/


    /*
async function validate(req) {
    if (!req.body.code) 
        throw new ValidationError('Request body does not contain a "code" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)

    if (!user.isUnvalidated()) 
        throw new ValidationError('User already validated')

    if (user.hasAttempts()) {
        try {
            user.validate(req.body.code) 
        } catch(e) {
            throw e
        } finally {
            await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
        }
    } else await DAO.delete(user).catch(e => { throw new InternalServerError(e.message) })
}
*/


    /*
async function login(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = getUserByEmail(req.body.email)

    if (user.isUnvalidated()) throw new UnauthorizedError('User is not yet validated')
    if (!user.login(req.body.password)) throw new UnauthorizedError('Password is incorrect')

    return {
        token: user.getJwt(), 
        user: { email: user.email, role: user.role, id: user.id, name: user.name }
    }
}
*/


    /*
async function onboarding(req) {
    const token = getTokenFromAuthHeader(req)
    const [name, surname, nif] = [ req.body.name, req.body.surname, req.body.nif ]

    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!surname) throw new ValidationError('Request body does not contain a "surname" field')
    if (!nif) throw new ValidationError('Request body does not contain a "nif" field')

    const user = getUserByJwt(token)

    // and then what?
}
*/


    /*
async function getByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token)
    const metadata = await DAO.getMetadata(user).catch(e => { throw new InternalServerError(e.message) })
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        nif: user.nif,
        role: user.role,
        status: user.status,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
    }
}
*/


    /*
async function deleteByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getUserByJwt(token) // we must first make sure the user exists before deleting it
    await DAO.delete(user)
}
*/


    /*
async function passwordRecovery(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')

    const user = await getUserByEmail(req.body.email)
    const updatedAt = await DAO.getMetadata(user)
        .then(r => r.updatedAt)
        .catch(e => { throw new InternalServerError(e.message) })

    const minutesPassed = (new Date() - new Date(updatedAt)) / 60000
    if (minutesPassed < 1)
        throw new UnauthorizedError(`There is a one minute cooldown for password recovery, ${(1 - minutesPassed)} minutes remaining`)

    user.recoverPassword()
    await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })

    const msg = `Your password recovery code is: ${this.code}`
    if (this.env.MODE === 'testing') emailService.sendMockEmail(this.email, msg)        
    else if (this.env.MODE === 'production') emailService.sendEmail(this.email, msg)
    else throw new UseCaseError(`Are you in 'testing' or 'production'? Please set MODE environment variable to either one of those`)
}
*/


    /*
async function passwordReset(req) {
    if (!req.body.code) throw new ValidationError('Request body does not contain a "code" field')
    if (!req.body.emaill) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const user = getUserByEmail(req.body.email)

    if (!user.hasAttempts()) 
        throw new AuthorizationError('No attempts left, please make a new password recovery request')

    user.resetPassword(req.body.code, req.body.password)
}


module.exports = { 
    register, 
    validate, 
    login, 
    onboarding, 
    getByJwt, 
    deleteByJwt,
    passwordRecovery,
    passwordReset
}
*/
