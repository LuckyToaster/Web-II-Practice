const DB = require('../infra/db')
const SuperDAO = require('./superDAO')


class CompanyDAO extends SuperDAO {
    constructor() {
        if (CompanyDAO._instance) 
            throw new Error('CompanyDAO is a singleton')
        CompanyDAO._instance = this
        this.#createTableIfNotExists()
    }

    #getById = async (id) => (await DB.query('select * from user where id = ?', [id]))[0][0]
    #getByCif = async (cif) => (await DB.query('select * from user where cif = ?', [cif]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from user where id = ?", [id]))[0][0]
    #deleteByCif = async (cif) => (await DB.query("delete FROM user where cif = ?", [cif]))[0][0]
    #createTableIfNotExists = async () => await DB.query(
        `CREATE TABLE IF NOT EXISTS company (
            id int auto_increment primary key, 
            cif char(9) unique,
            name varchar(128),
            address varchar(256),
            postalCode int,
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
    )


    async getAll() {
        const [res] = await DB.query("select * from company")
        return res
    }

    async get(obj) { 
        if (obj.id) return await this.#getById(obj.id)
        if (obj.cif) return await this.#getByCif(obj.email)
        const [query, vals] = this.getSelectQueryData(obj, 'company')
        const [res] = await DB.query(query, vals)
        return res
    }

    async delete(obj) {
        if (obj.id) return await this.#deleteById(obj.id) 
        if (obj.cif) return await this.#deleteByCif(obj.email)
        const [query, vals] = this.getDeleteQueryData(obj, 'company')
        const [res] = await DB.query(query, vals)
        return res
    }

    async update(obj) { 
        const [query, vals] = this.getUpdateQueryData(obj, 'company')
        const [res] = await DB.query(query, vals)
        return res
    }

    async insert(obj) {
        const [query, vals] = this.getInsertQueryData(obj, 'company')
        vals.pop() // no need for 'id' value since its an insert
        const [res] = await DB.query(query, vals)
        return res
    }

    async getAll() {
        const [res] = await DB.query("select * from company")
        return res
    }
}

module.exports = new CompanyDAO()
