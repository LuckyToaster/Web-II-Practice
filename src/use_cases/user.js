const DAO = require('../dao/userDAO')
const User = require('../entities/user')
const { 
    InternalServerError, 
    ConflictError, 
    NotFoundError, 
    UnauthorizedError, 
    ValidationError 
} = require('../infra/errors')


function getTokenFromAuthHeader(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new UnauthorizedError('Request does not contain an "Authorization" header')
    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('Request header does not contain an authorization token')
    return token
}


async function getByJwt(token) {
    const user = User.verifyJwt(token)
    const data = await DAO.get(user).catch(e => { throw new InternalServerError(e.message) })
    const errStr = `User with id: ${user.id}, email: ${user.email} not found. (it was probably deleted manually or after validation failed)`
    if (!data) throw new NotFoundError(errStr)
    return new User(data)
}


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


async function validation(req) {
    if (!req.body.code) 
        throw new ValidationError('Request body does not contain a "code" field')

    const token = getTokenFromAuthHeader(req)
    const user = await getByJwt(token)

    if (user.isValidated()) 
        throw new ValidationError('User already validated')
    else if (user.hasValidationCode(req.body.code)) {
        user.validate()
        await DAO.update(user).catch(e => { throw new InternalServerError(e.message) })
    } else {
        user.decrementNumAttempts()
        try {
            if (!user.hasAttempts()) await DAO.delete(user)
            else await DAO.update(user)
        } catch (e) {
            throw new InternalServerError(e.message)
        } finally {
            const errStr = `Code is not valid, ${user.numAttempts} validation ${user.numAttempts == 1 ? 'attempt' : 'attempts'} left`
            throw new ValidationError(errStr)
        }
    }
}


async function login(req) {
    if (!req.body.email) throw new ValidationError('Request body does not contain an "email" field')
    if (!req.body.password) throw new ValidationError('Request body does not contain a "password" field')

    const query = new User({email: req.body.email})  
    const data = await DAO.get(query).catch(e => { throw new InternalServerError(e.message) })
    if (!data) throw new NotFoundError(`User with email: ${req.body.email} not found`)

    const user = new User(data)
    if (!user.isValidated()) throw new UnauthorizedError('User is not validated')
    if (!user.login(req.body.password)) throw new UnauthorizedError('Password is incorrect')

    return {
        token: user.getJwt(), 
        user: { email: user.email, role: user.role, id: user.id, name: user.name }
    }
}


async function onboarding(req) {
    const token = getTokenFromAuthHeader(req)
    const [name, surname, nif] = [ req.body.name, req.body.surname, req.body.nif ]

    if (!name) throw new ValidationError('Request body does not contain a "name" field')
    if (!surname) throw new ValidationError('Request body does not contain a "surname" field')
    if (!nif) throw new ValidationError('Request body does not contain a "nif" field')

    const user = getByJwt(token)

    // and then what?
}


async function getUserByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getByJwt(token)
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


async function deleteUserByJwt(req) {
    const token = getTokenFromAuthHeader(req)
    const user = await getByJwt(token) // we must first make sure the user exists before deleting it
    await DAO.delete(user)
}


module.exports = { register, validation, login, onboarding, getUserByJwt, deleteUserByJwt }
