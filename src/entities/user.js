const { ValidationError, UnauthorizedError, UseCaseError } = require('../infra/errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


class User {
    static #status = { validated: 'validated', unvalidated: 'unvalidated', recovery: 'recovery' }
    static #genCode = () => Array(6).fill(0).map(_ => Math.floor(Math.random() * 10)).join('')
    static #emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 

    constructor(obj) {
        if (!obj.id && !obj.email) 
            throw new UseCaseError(`User requires object with either 'email' or 'id' field in the constructor`)
        this.id = obj.id?? null 
        this.email = obj.email? obj.email.toLowerCase(): null
        this.password = obj.password?? null
        this.name = obj.name?? null
        this.surname = obj.surname?? null
        this.nif = obj.nif?? null
        this.role = obj.role?? null
        this.status = obj.status?? null
        this.code = obj.code?? null
        this.numAttempts = obj.numAttempts ?? null 
        this.createdAt = obj.createdAt ?? null
        this.updatedAt = obj.updatedAt ?? null
    }

    static create(email, password) {
        if (password.length < 8) throw new ValidationError('Password must be 8 characters or longer')
        if (!email.match(User.#emailRe)) throw new ValidationError('Email must be valid')
        return new User({
            email: email.toLowerCase(), 
            password: bcrypt.hashSync(password, 10), 
            code: User.#genCode(),
            numAttempts: 3, 
            role: 'user', 
            status: User.#status.unvalidated 
        })
    }

    static verifyJwt(token) {
        try {
            return new User(jwt.verify(token, process.env.JWT_SECRET))
        } catch (e) {
            if (e.name === 'TokenExpiredError') throw new UnauthorizedError('JWT expired')
            else throw new UnauthorizedError('JWT verification failed')
        }
    }

    hasAttempts() { 
        return this.numAttempts > 0 
    }

    isValidated() { 
        return this.status === User.#status.validated 
    }

    isUnvalidated() { 
        return this.status === User.#status.unvalidated 
    }

    isRecoveringPassword() { 
        return this.status === User.#status.recovery 
    }

    login(password) { 
        return bcrypt.compareSync(password, this.password) 
    }

    getJwt() { 
        return jwt.sign({ email: this.email, id: this.id }, process.env.JWT_SECRET, { expiresIn: '15m' }) 
    }

    validate(code) {
        if (this.code !== code && this.numAttempts > 0) {
            this.numAttempts -= 1
            const error = `Code is not valid, ${this.numAttempts} ${this.numAttempts == 1 ? 'attempt' : 'attempts'} left`
            throw new ValidationError(error)
        }
        this.status = User.#status.validated
    }

    setName(name) {
        if (name.length > 128 || name.length < 2) 
            throw new ValidationError('"name" must be between 2 and 128 characters long')
        this.name = name
    }

    setSurname(surname) {
        if (surname.length > 128 || surname.length < 2) 
            throw new ValidationError('"surname" must be between 2 and 128 characters long')
        this.surname = surname 
    }

    setNif(nif) {
        if (nif.length != 9) throw new ValidationError('"nif" must be exactly 9 characters long')
        const correct = nif.slice(0, 8).split('').filter(n => isNaN(parseInt(n))) && isNaN(parseInt(nif[8]))
        if (!correct) throw new ValidationError('"nif" must be a valid nif')
        this.nif = nif
    }

    recoverPassword() {
        if (this.status === User.#status.unvalidated) 
            throw new ValidationError('Cannot begin password recovery process if the user is not yet validated')
        this.code = User.#genCode()
        this.status = User.#status.recovery
        this.numAttempts = 3
    }

    resetPassword(code, password) {
        if (password.length < 8) throw new ValidationError('Password must be 8 characters or longer')
        if (!this.hasAttempts()) throw new UnauthorizedError('No attempts left, please make a new password recovery request')

        try {
            this.validate(code)
        } catch (validateError) {
            if (!this.hasAttempts()) throw new UnauthorizedError('No attempts left, please make a new password recovery request')
            else throw validateError
        }
        this.password = bcrypt.hashSync(password, 10)  
    }

    masked() {
        delete this.password
        delete this.code
        delete this.numAttempts
        return this
    }
}


module.exports = User
