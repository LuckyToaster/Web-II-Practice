const { UnauthorizedError, ValidationError } = require('../infra/errors')
const jwt = require('jsonwebtoken')
require('dotenv').config()


class Project {
    static #isSqlDate = (d) => typeof d === 'string' && d.at(4) === '-' && d.at(7) === '-'
    static #isSqlTimeStamp = (t) => Project.#isSqlDate(t) && t.at(10) === ' ' && t.at(13) === ':' && t.at(16) === ':'
    static #isValidDate = (d) => d instanceof Date && !isNaN(d)
    static #toSqlDate = (date) => date.toISOString().split('T')[0]

    constructor(obj) {
        if (!obj.id && (!obj.clientId || !obj.userId))
            throw new ValidationError(`Project requires object with either an 'id' field or 'clientId' and 'userId' fields in the constructor`)

        if (obj.id) this.setId(obj.id)
        else this.id = null

        if (obj.userId) this.setUserId(obj.userId)
        else this.userId = null

        if (obj.clientId) this.setClientId(obj.clientId)
        else this.clientId = null

        if (obj.name) this.setName(obj.name)
        else this.name = null

        if (obj.address) this.setAddress(obj.address)
        else this.address = null

        if (obj.postalCode) this.setPostalCode(obj.postalCode)
        else this.postcalCode = null

        if (obj.city) this.setCity(obj.city)
        else this.city = null

        if (obj.province) this.setProvince(obj.province)
        else this.province = null

        if (obj.notes) this.setNotes(obj.notes)
        else this.notes = null

        if (obj.projectCode) this.setProjectCode(obj.projectCode)
        else this.projectCode = null

        if (obj.begin) this.setBegin(obj.begin)
        else this.begin = null

        if (obj.end) this.setBegin(obj.end)
        else this.end = null

        if (obj.deleted) this.#setDeleted(obj.deleted)
        else this.deleted = null

        this.createdAt = obj.createdAt?? null
        this.updatedAt = obj.updatedAt?? null
    }

    #setDeleted(deleted) {
        if (typeof deleted !== 'boolean') 
            throw new ValidationError(`'deleted' should be a boolean`)
        this.deleted = deleted
    }

    #setId(val, id) {
        if (typeof id !== 'number') 
            throw new ValidationError('Please make sure you are passing an id')
        this[val] = id
        return this
    }

    static verifyJwt(token) {
        try {
            return new Project(jwt.verify(token, process.env.JWT_SECRET))
        } catch (e) {
            if (e.name === 'TokenExpiredError') throw new UnauthorizedError('JWT expired')
            else throw new UnauthorizedError('JWT verification failed')
        }
    }

    getJwt() { 
        return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '15m' }) 
    }

    generateCode() {
        this.projectCode = Array(6).fill(0).map(_ => Math.floor(Math.random() * 10)).join('')
        return this
    }

    softDelete() { 
        this.delete = true 
        return this
    }

    setId(id) { 
        this.#setId('id', id) 
        return this
    }

    setUserId(id) { 
        this.#setId('userId', id) 
        return this
    }

    setClientId(id) { 
        this.#setId('clientId', id) 
        return this
    }

    setName(name) {
        if (name.length > 128 || name.length < 2) 
            throw new ValidationError('Company name must be between 2 and 128 characters long')
        this.name = name
        return this
    }

    setAddress(address) {
        if (address.length > 128 || address.length < 2) 
            throw new ValidationError('Company address must be between 2 and 128 characters long')
        this.address = address
        return this
    }

    setPostalCode(postalCode) {
        if (typeof postalCode !== 'number') 
            throw new ValidationError('Company postalCode must be an integer')
        this.postalCode = postalCode
        return this
    }

    setCity(city) {
        if (city.length > 128 || city.length < 2) 
            throw new ValidationError('Company city must be between 2 and 128 characters long')
        this.city = city
        return this
    }

    setProvince(province) {
        if (province.length > 128 || province.length < 2) 
            throw new ValidationError('Company province must be between 2 and 128 characters long')
        this.province = province
        return this
    }

    setNotes(notes) {
        if (typeof notes !== 'string' || notes.length > 256 || notes.length === 0) 
            throw new ValidationError(`'notes' should be of type string, between 1 and 256 characters or less`)
        this.notes = notes
        return this
    }

    setProjectCode(code) {
        if (typeof code !== 'string' || code.length !== 6)
            throw new ValidationError(`'projectCode' must be a string of exactly 6 numeric characters`)
        this.projectCode = code
        return this
    }

    setBegin(begin) {
        if (Project.#isValidDate(begin)) this.begin = Project.#toSqlDate(begin)
        else if (Project.#isSqlDate(begin)) this.begin = begin
        else throw new ValidationError(`'begin' must come either as Date js object or SQL DATE string`)
        return this
    }

    setEnd(end) {
        if (Project.#isValidDate(end)) this.end = Project.#toSqlDate(end)
        else if (Project.#isSqlDate(begin)) this.end = end
        else throw new ValidationError(`'end' must be either a Date js object or SQL DATE string`)
        return this
    }

    masked() {
        const keys = Object.keys(this).filter(k => this[k] === null)
        keys.forEach(k => delete this[k])
        return this
    }
}


module.exports = Project
