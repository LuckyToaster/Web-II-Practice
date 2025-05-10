const { ValidationError, UnauthorizedError, UseCaseError } = require('../infra/errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class Client {
    constructor(obj) {
        if (!obj.id && !obj.cif) 
            throw new UseCaseError(`Client requires object with either 'cif' or 'id' field in the constructor`)
        this.id = obj.id?? null
        this.cif = obj.cif?? null
        this.name = obj.name?? null
        this.address = obj.address?? null
        this.postalCode = obj.postalCode?? null
        this.city = obj.city?? null
        this.province = obj.province?? null
        this.deleted  = obj.deleted?? null
        this.logo = obj.logo?? null
        this.activeProjects = obj.activeProjects?? null
        this.pendingDeliveryNotes = obj.deliveryNotes?? null
        this.userId = obj.userId?? null
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

    getJwt() { 
        return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '15m' }) 
    }
}


module.exports = Client
