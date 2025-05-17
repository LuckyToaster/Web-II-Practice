const { InternalServerError } = require('../infra/errors')
const DB = require('../infra/db')
const SuperDAO = require('./super')
const Project = require('../entities/project')


class ProjectDAO extends SuperDAO {
    constructor() {
        super()
        if (ProjectDAO._instance) 
            throw new Error('ProjectDAO is a singleton')
        ProjectDAO._instance = this
    }

    async createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS project (
                id int auto_increment primary key, 
                userId int,
                clientId int,

                name varchar(128),
                notes varchar(256),
                projectCode varchar(6),
                begin date,
                end date,

                address varchar(128),
                postalCode int,
                city varchar(128),
                province varchar(128),

                deleted bool,

                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES user(id),
                FOREIGN KEY (clientId) REFERENCES client(id)
            )`
        )
    }

    async getAll() {
        try {
            const [res] = await DB.query("select * from project")
            return res.length === 0? null : res.map(r => new Project(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async get(obj) { 
        try {
            if (obj.id) {
                const data = await this.#getById(obj.id)
                return data? new Client(data) : null
            }

            const [query, vals] = this.getSelectQueryData(obj, 'project')
            const [res] = await DB.query(query, vals)

            if (res.length === 0) return null
            if (res.length === 1) return new Project(res[0])
            return res.map(r => new Project(r))
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async delete(obj) {
        try {
            if (obj.id) return await this.#deleteById(obj.id) 
            const [query, vals] = this.getDeleteQueryData(obj, 'project')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async update(obj) { 
        try {
            const [query, vals] = this.getUpdateQueryData(obj, 'project')
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    async insert(obj) {
        try {
            const [query, vals] = this.getInsertQueryData(obj, 'project')
            vals.pop() // no need for 'id' value since its an insert
            const [res] = await DB.query(query, vals)
            return res
        } catch (e) {
            throw new InternalServerError(e.message)
        }
    }

    #getById = async (id) => (await DB.query('select * from project where id = ?', [id]))[0][0]
    #deleteById = async (id) => (await DB.query("delete from project where id = ?", [id]))[0][0]
}


module.exports = new ProjectDAO()
