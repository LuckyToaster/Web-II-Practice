const SuperDAO = require('./superDAO')
const DB = require('../infra/db')

class UserDAO extends SuperDAO {

    constructor() {
        super()
        if (UserDAO._instance) throw new Error('UserDAO is a singleton')
        UserDAO._instance = this
        this.#createTableIfNotExists()
    }

    #getById = async (id) => (await DB.query('select * from user where id = ?', [id]))[0][0]
    #getByEmail = async (email) => (await DB.query('select * from user where email = ?', [email]))[0][0]
    #deleteById = async (id) => (await DB.query("delete FROM user where id = ?", [id]))[0][0]
    #deleteByEmail = async (email) => (await DB.query("delete FROM user where email = ?", [email]))[0][0]
    #createTableIfNotExists = async () => await DB.query(
        `CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            email varchar(128) not null,
            password char(60) not null,
            name varchar(128), 
            surname varchar(128), 
            nif char(9) unique, 
            role varchar(7), 
            status bool, 
            code char(6), 
            numAttempts int,
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
    )

    async getAll() {
        const [res] = await DB.query("select * from user")
        return res
    }

    async get(obj) { 
        if (obj.id) return await this.#getById(obj.id)
        if (obj.email) return await this.#getByEmail(obj.email)
        const [query, vals] = this.getSelectQueryData(obj, 'user')
        const [res] = await DB.query(query, vals)
        return res
    }

    async delete(obj) {
        if (obj.id) return await this.#deleteById(obj.id) 
        if (obj.email) return await this.#deleteByEmail(obj.email)
        const [query, vals] = this.getDeleteQueryData(obj, 'user')
        const [res] = await DB.query(query, vals)
        return res
    }

    async update(obj) { 
        const [query, vals] = this.getUpdateQueryData(obj, 'user')
        const [res] = await DB.query(query, vals)
        return res
    }

    async insert(obj) {
        const [query, vals] = this.getInsertQueryData(obj, 'user')
        vals.pop() // no need for 'id' value since its an insert
        const [res] = await DB.query(query, vals)
        return res
    }

    async getMetadata(obj) {
        if (obj.id) {
            const [res] = await DB.query('select createdAt, updatedAt from user where id = ?', [obj.id]) 
            return res[0]
        } else if (obj.email) {
            const [res] = await DB.query('select createdAt, updatedAt from user where email = ?', [obj.email]) 
            return res[0]
        }
    }
}


module.exports = new UserDAO()
