const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { ValidationError, UnauthorizedError, UseCaseError } = require('../infra/errors')


class User {
    static #status = { validated: 'validated', unvalidated: 'unvalidated', recovery: 'recovery' }
    static #emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    static #genCode = () => Array(6).fill(0).map(_ => Math.floor(Math.random() * 10)).join('')

    constructor(obj) {
        if (!obj.id && !obj.email) 
            throw new UseCaseError(`User instance requires an object with either an 'email' or an 'id' field in the constructor`)
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
            throw new UnauthorizedError('JWT verification failed')
        }
    }

    getJwt() { 
        return jwt.sign({ email: this.email, id: this.id }, process.env.JWT_SECRET) 
    }

    // THE FOLLOWING METHODS MUST ONLY BE CALLED IF THE USER WAS INSTANTIATED WITH DAO DATA
    isValidated() { return this.status === User.#status.validated }
    isRecoveringPassword() { return this.status === User.#status.recovery }
    //validate() { this.status = 1 }
    //decrementNumAttempts() { this.numAttempts -= 1 }
    hasAttempts() { return this.numAttempts > 0 }
    //hasValidationCode(code) { return code === this.code }
    login(password) { return bcrypt.compareSync(password, this.password) }

    validate(code) {
        if (this.code !== code) {
            this.numAttempts -= 1
            const error = `Code is not valid, ${this.numAttempts} validation ${this.numAttempts == 1 ? 'attempt' : 'attempts'} left`
            throw new ValidationError(error)
        }
        this.status = User.#status.validated
    }

    validateAndSetName(name) {
        if (name.length > 128) throw new ValidationError('"name" must be less than 128 characters')
        this.name = name
    }

    validateAndSetSurname(surname) {
        if (surname.length > 128) throw new ValidationError('"surname" must be less than 128 characters')
        this.surname = surname 
    }

    validateAndSetNIF(nif) {
        if (nif.length != 9) throw new ValidationError('"nif" must be exactly 9 characters long')
        const correct = nif.slice(0, 8).split('').filter(n => isNaN(parseInt(n))) && isNaN(parseInt(nif[8]))
        if (!correct) throw new ValidationError('"nif" must be a valid nif')
        this.nif = nif
    }

    recoverPassword(email, emailService) {
        if (this.status === User.#status.unvalidated) 
            throw new ValidationError('Cannot begin password recovery process if the user is not yet validated')

        this.code = User.#genCode()
        this.status = User.#status.recovery
        this.numAttempts = 3

        const msg = `Your password recovery code is: ${this.code}`
        if (this.env.MODE === 'testing') emailService.sendMockEmail(email, msg)        
        else if (this.env.MODE === 'production') emailService.sendEmail(email, msg)
        else throw new UseCaseError(`Are you in 'testing' or 'production'? Please set MODE environment variable to either one of those`)
    }

    resetPassword(code, password) {
        if (password.length < 8) throw new ValidationError('Password must be 8 characters or longer')
        this.validate(code)
        this.password = bcrypt.hashSync(password, 10)  
    }
}


module.exports = User
