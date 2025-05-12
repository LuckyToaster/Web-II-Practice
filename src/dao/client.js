const { InternalServerError, NotFoundError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')
const Client = require('../entities/client')


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
                companyId int,

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
                foreign key (userId) references user(id) on delete set null on update cascade,
                foreign key (companyId) references company(id) on delete set null on update cascade
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from client")
            if (res.length === 0) throw new NotFoundError('Client Table is empty')
            return res.map(r => new Client(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) {
                const data = await this.#getById(obj.id)
                if (!data) throw new NotFoundError(`id: ${obj.id} not found`)
                return new Client(data)
            }

            if (obj.cif) { 
                const data = await this.#getByCif(obj.cif)
                if (!data) throw new NotFoundError(`cif: ${obj.cif} not found`)
                return new Client(data)
            }

            const [query, vals] = this.getSelectQueryData(obj, 'client')
            const [res] = await DB.query(query, vals)
            
            if (res.length === 0) throw new NotFoundError(`Nothing found for the query: ${obj}`)
            if (res.length === 1) return new Client(res[0])
            return res.map(r => new Client(r))
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
