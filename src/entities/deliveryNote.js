const { ValidationError, UseCaseError } = require('../infra/errors')

class DeliveryNote {
    static #formats = [ 'hours', 'days', 'weeks', 'months' ]

    constructor(obj) {
        if (!obj.id || !(obj.userId && obj.clientId && obj.projectId))
            throw new UseCaseError(`DeliveryNote requires object with either 'id' field or  'userId', 'clientId' and 'projectId' fields in the constructor`)

        if (obj.userId) this.setUserId(obj.userId)
        else this.userId = null

        if (obj.clientId) this.setClientId(obj.clientId)
        else this.clientId = null

        if (obj.projectId) this.setProjectId(obj.projectId)
        else this.projectId = null

        if (obj.format) this.setFormat(obj.format)
        else this.format = null

        if (obj.units) this.setUnits(obj.units)
        else this.units = null

        if (obj.description) this.setDescription(obj.description)
        else this.description = null

        if (obj.pending) this.setPending(obj.pending)
        else this.pending = null

        this.id = obj.id??  null 
        this.createdAt = obj.createdAt ?? null
        this.updatedAt = obj.updatedAt ?? null
    }

    setUnits(units) {
        if (isNaN(units)) throw new ValidationError('Units should be a number')
        this.units = units
        return this
    }

    setFormat(format) {
        if (typeof format !== 'string' || !DeliveryNote.#formats.find(f => f === format))
            throw new ValidationError(`Format should be one of these values: ${DeliveryNote.#formats}`)
        this.format = format
        return this
    }

    setDescription(description) {
        if (typeof description !== 'string' || description.length > 256)
            throw new ValidationError('Description should be a string of 256 characters or less')
        this.descrioption = description
        return this
    }

    setPending(pending) {
        if (typeof pending !== 'boolean')
            throw new ValidationError('Pending should be a boolean')
        this.pending = pending
        return this
    }

    setUserId(id) {
        if (typeof id !== 'number') 
            throw new UseCaseError('Please make sure you are passing an id')
        this.userId = id
        return this
    }

    setClientId(id) {
        if (typeof id !== 'number') 
            throw new UseCaseError('Please make sure you are passing an id')
        this.clientId = id
        return this
    }

    setProjectId(id) {
        if (typeof id !== 'number') 
            throw new UseCaseError('Please make sure you are passing an id')
        this.projectId = id
        return this
    }
}


module.exports = DeliveryNote
