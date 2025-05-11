const { InternalServerError } = require('../infra/errors')
const User = require('../entities/user')
const SuperDAO = require('./super')
const DB = require('../infra/db')


class UserDAO extends SuperDAO {
    constructor() {
        super()
        if (UserDAO._instance) throw new Error('UserDAO is a singleton')
        UserDAO._instance = this
        this.#createTableIfNotExists()
    }

    async #createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS user (
                id int auto_increment primary key, 
                email varchar(128) unique not null,
                password char(60) not null,
                nif char(9) unique, 
                name varchar(128), 
                surname varchar(128), 
                role varchar(7), 
                status varchar(11), 
                code char(6), 
                numAttempts int,
                deleted bool,
                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                companyId int, 
                pfpUrl varchar(256),
                foreign key (companyId) references company(id) on delete set null on update cascade
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from user")
            return res.map(r => new User(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) {
                const data = await this.#getById(obj.id)
                return data? new User(data): null
            }

            if (obj.email) {
                const data = await this.#getByEmail(obj.email)
                return data? new User(data): null
            }

            const [query, vals] = this.getSelectQueryData(obj, 'user')
            const [res] = await DB.query(query, vals)

            if (res.length === 0) return null
            if (res.length === 1) return new User(res[0])
            return res.map(r => new User(r))

        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
            if (obj.email) return await this.#deleteByEmail(obj.email)
            const [query, vals] = this.getDeleteQueryData(obj, 'user')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async update(obj) { 
        try {
            const [query, vals] = this.getUpdateQueryData(obj, 'user')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async insert(obj) {
        try {
            const [query, vals] = this.getInsertQueryData(obj, 'user')
            vals.pop() // no need for 'id' value since its an insert
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    #getById = async (id) => (await DB.query('select * from user where id = ?', [id]))[0][0]
    #getByEmail = async (email) => (await DB.query('select * from user where email = ?', [email]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from user where id = ?", [id]))[0][0]
    #deleteByEmail = async (email) => (await DB.query("delete FROM user where email = ?", [email]))[0][0]
}


module.exports = new UserDAO()
