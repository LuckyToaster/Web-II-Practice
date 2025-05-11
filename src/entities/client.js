const { ValidationError, UnauthorizedError, UseCaseError } = require('../infra/errors')
const jwt = require('jsonwebtoken')
require('dotenv').config()


class Client {
    constructor(obj) {
        if (!obj.id && !obj.cif) 
            throw new UseCaseError(`Client requires object with either 'cif' or 'id' field in the constructor`)

        if (obj.cif) this.setCif(obj.cif)
        else this.cif = null

        if (obj.userId) this.setUserId(obj.userId)
        else this.userId = null

        if (obj.name) this.setName(obj.name)
        else this.name = null

        if (obj.address) this.setAddress(obj.address)
        else this.address = null

        if (obj.postalCode) this.setPostalCode(obj.postalCode)
        else this.postalCode = null

        if (obj.city) this.setCity(obj.city)
        else this.city = null

        if (obj.province) this.setProvince(obj.province)
        else this.province = null

        if (obj.logo) this.setLogo(obj.logo)
        else this.logo = null

        if (obj.activeProjects) this.setActiveProjects(obj.activeProjects)
        else this.activeProjects = null

        if (obj.pendingDeliveryNotes) this.setPendingDeliveryNotes(obj.pendingDeliveryNotes)
        else this.pendingDeliveryNotes = null

        this.id = obj.id?? null
        this.deleted  = obj.deleted?? null
        this.createdAt = obj.createdAt?? null
        this.updatedAt = obj.updatedAt?? null
    }

    static verifyJwt(token) {
        try {
            return new Client(jwt.verify(token, process.env.JWT_SECRET))
        } catch (e) {
            if (e.name === 'TokenExpiredError') throw new UnauthorizedError('JWT expired')
            else throw new UnauthorizedError('JWT verification failed')
        }
    }

    getJwt() { return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '15m' }) }
    softDelete() { this.deleted = true }

    setCif(cif) {
        if (cif.length != 9) throw new ValidationError('"cif" must be exactly 9 characters long')
        const correct = cif.slice(0, 8).split('').filter(n => isNaN(parseInt(n))).length === 0 && isNaN(parseInt(cif[8]))
        if (!correct) throw new ValidationError('"nif" must be a valid nif')
        this.cif = cif
        return this
    }

    setUserId(id) {
        if (typeof id !== 'number') 
            throw new UseCaseError('Please make sure you are passing an id')
        this.companyId = id
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

    setLogo(logo) {
        if (logo.length > 256) throw new ValidationError('Logo path must be less than 256 characters')
        this.logo = logo
        return this
    }

    setActiveProjects(n) {
        if (typeof n !== 'number') throw new UseCaseError('ActiveProjects must be a number')
        this.activeProjects = n
        return this
    }

    setPendingDeliveryNotes(n) {
        if (typeof n !== 'number') throw new UseCaseError('PendingDeliveryNotes must be a number')
        this.activeProjects = n
        return this
    }
}


module.exports = Client
