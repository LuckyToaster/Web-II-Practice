const { UnauthorizedError, UseCaseError } = require('../infra/errors')
const jwt = require('jsonwebtoken')
require('dotenv').config()


class Project {
    constructor(obj) {
        if (!obj.id || (!obj.clientId || !obj.userId))
            throw new UseCaseError(`Project requires object with either an 'id' field or 'clientId' and 'userId' fields in the constructor`)
        this.id = obj.id?? null 
        this.userId = obj.userId?? null
        this.clientId = obj.clientId?? null

        this.address = obj.address?? null
        this.postalCode = obj.postalCode?? null
        this.city = obj.city?? null
        this.province = obj.province?? null

        this.name = obj.name?? null
        this.notes = obj.notes?? null
        this.projectCode = obj.projectCode?? null
        this.begin = obj.begin?? null
        this.end = obj.end?? null

        this.deleted = obj.deleted ?? null

        this.createdAt = obj.createdAt ?? null
        this.updatedAt = obj.updatedAt ?? null
    }

    static verifyJwt(token) {
        try {
            return new Project(jwt.verify(token, process.env.JWT_SECRET))
        } catch (e) {
            if (e.name === 'TokenExpiredError') throw new UnauthorizedError('JWT expired')
            else throw new UnauthorizedError('JWT verification failed')
        }
    }

    getJwt() { return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '15m' }) }
    softDelete() { this.delete = true }

}


module.exports = Project
