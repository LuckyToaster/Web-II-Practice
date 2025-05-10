const { InternalServerError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')


class ClientDAO extends SuperDAO {
    constructor() {
        super()
        if (ClientDAO._instance) 
            throw new Error('ClientDAO is a singleton')
        ClientDAO._instance = this
        this.#createTableIfNotExists()
    }

    async #createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS client (
                id int auto_increment primary key, 
                cif char(9) unique,
                name varchar(128),
                userId int,

                address varchar(128),
                postalCode int,
                city varchar(128),
                province varchar(128),
                deleted bool,
                logo varchar(256),

                activeProjects int,
                pendingDeliveryNotes int,

                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                foreign key userId references user(id)
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from client")
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) return await this.#getById(obj.id)
            if (obj.cif) return await this.#getByCif(obj.cif)
            const [query, vals] = this.getSelectQueryData(obj, 'client')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
            if (obj.cif) return await this.#deleteByCif(obj.cif)
            const [query, vals] = this.getDeleteQueryData(obj, 'client')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async update(obj) { 
        try {
            const [query, vals] = this.getUpdateQueryData(obj, 'client')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async insert(obj) {
        try {
            const [query, vals] = this.getInsertQueryData(obj, 'client')
            vals.pop() // no need for 'id' value since its an insert
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    #getById = async (id) => (await DB.query('select * from client where id = ?', [id]))[0][0]
    #getByCif = async (cif) => (await DB.query('select * from client where cif = ?', [cif]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from client where id = ?", [id]))[0][0]
    #deleteByCif = async (cif) => (await DB.query("delete FROM client where cif = ?", [cif]))[0][0]
}

module.exports = new ClientDAO()
