const { InternalServerError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')
const Company = require('../entities/company')


class CompanyDAO extends SuperDAO {
    constructor() {
        super()
        if (CompanyDAO._instance) 
            throw new Error('CompanyDAO is a singleton')
        CompanyDAO._instance = this
    }

    async createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS company (
                id int auto_increment primary key, 
                cif char(9) unique,
                name varchar(128),
                address varchar(128),
                postalCode int,
                city varchar(128),
                province varchar(128),
                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from company")
            return res.map(r => new Company(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) {
                const data = await this.#getById(obj.id)
                return data? new Company(data): null
            }
            if (obj.cif) {
                const data = await this.#getByCif(obj.cif)
                return data? new Company(data): null
            }

            const [query, vals] = this.getSelectQueryData(obj, 'company')
            const [res] = await DB.query(query, vals)

            if (res.length === 0) return null
            if (res.length === 1) return new Company(res[0])
            return res.map(r => new Company(r))

        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
            if (obj.cif) return await this.#deleteByCif(obj.cif)
            const [query, vals] = this.getDeleteQueryData(obj, 'company')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async update(obj) { 
        try {
            const [query, vals] = this.getUpdateQueryData(obj, 'company')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async insert(obj) {
        try {
            const [query, vals] = this.getInsertQueryData(obj, 'company')
            vals.pop() // no need for 'id' value since its an insert
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    #getById = async (id) => (await DB.query('select * from company where id = ?', [id]))[0][0]
    #getByCif = async (cif) => (await DB.query('select * from company where cif = ?', [cif]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from company where id = ?", [id]))[0][0]
    #deleteByCif = async (cif) => (await DB.query("delete FROM company where cif = ?", [cif]))[0][0]
}


module.exports = new CompanyDAO()
