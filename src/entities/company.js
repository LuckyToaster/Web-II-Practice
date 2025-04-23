const { UseCaseError, ValidationError } = require('../../infra/errors')


class Company {
    constructor(obj) {
        if (!obj.id && !obj.cif) 
            throw new UseCaseError('Company requires object with either "id" or "cif" field in the constructor')
        this.id = obj.id ?? null
        this.name = obj.name ?? null
        this.cif = obj.cif ?? null
        this.address = obj.address ?? null
        this.postal = obj.postal ?? null
        this.city = obj.city ?? null
        this.province = obj.province ?? null
        this.createdAt = obj.createdAt ?? null
        this.updatedAt = obj.updatedAt ?? null
    }

    setCif(cif) {
        if (address.length > 128 || address.length < 2) 
            throw new ValidationError('Company address must be between 2 and 128 characters long')
        this.address = address
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
        if (postalCode.length > 128 || postalCode.length < 2) 
            throw new ValidationError('Company postalCode must be between 2 and 128 characters long')
        this.postalCode = address
        return this
    }

    setCity(city) {
        if (city.length > 128 || city.length < 2) 
            throw new ValidationError('Company city must be between 2 and 128 characters long')
        this.city = address
        return this
    }

    setProvince(province) {
        if (province.length > 128 || province.length < 2) 
            throw new ValidationError('Company province must be between 2 and 128 characters long')
        this.province = province
        return this
    }
}


module.exports = Company
