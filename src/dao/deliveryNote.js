const { InternalServerError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')
const DeliveryNote = require('../entities/deliveryNote')


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
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                FOREIGN KEY (userId) REFERENCES user(id) on delete set null on update cascade,
                FOREIGN KEY (clientId) REFERENCES client(id) on delete set null on update cascade,
                FOREIGN KEY (projectId) REFERENCES project(id) on delete set null on update cascade
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from deliveryNote")
            return res.map(r => new DeliveryNote(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) {
                const data = await this.#getById(obj.id)
                return data? new DeliveryNote(data): null
            }

            const [query, vals] = this.getSelectQueryData(obj, 'deliveryNote')
            const [res] = await DB.query(query, vals)

            if (res.length === 0) return null
            if (res.length === 1) return new DeliveryNote(res[0])
            return res.map(r => new DeliveryNote(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
            const [query, vals] = this.getDeleteQueryData(obj, 'deliveryNote')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async update(obj) { 
        try {
            const [query, vals] = this.getUpdateQueryData(obj, 'deliveryNote')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async insert(obj) {
        try {
            const [query, vals] = this.getInsertQueryData(obj, 'deliveryNote')
            vals.pop() // no need for 'id' value since its an insert
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    #getById = async (id) => (await DB.query('select * from deliveryNote where id = ?', [id]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from deliveryNote where id = ?", [id]))[0][0]
}


module.exports = new DeliveryNoteDAO()
