const { InternalServerError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')


class DeliveryNoteDAO extends SuperDAO {
    constructor() {
        super()
        if (DeliveryNoteDAO._instance) 
            throw new Error('DeliveryNoteDAO is a singleton')
        DeliveryNoteDAO._instance = this
        this.#createTableIfNotExists()
    }

    async #createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS deliveryNote (
                id int auto_increment primary key, 

                userId int,
                clientId int,
                projectId int,

                format varchar(128),
                units int,
                description varchar(256),
                pending bool,

                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

                FOREIGN KEY (userId) REFERENCES user(id),
                FOREIGN KEY (clientId) REFERENCES client(id)
                FOREIGN KEY (projectId) REFERENCES project(id)
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from company")
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) return await this.#getById(obj.id)
            const [query, vals] = this.getSelectQueryData(obj, 'company')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
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
    #deleteById = async (id) => (await DB.query("delete from company where id = ?", [id]))[0][0]
}


module.exports = new CompanyDAO()
