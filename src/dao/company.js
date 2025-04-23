const DB = require('../infra/db')

class CompanyDAO {
    constructor() {
        if (CompanyDAO._instance) 
            throw new Error('CompanyDAO is a singleton')
        CompanyDAO._instance = this
        this.#createTableIfNotExists()
    }

    async #createTableIfNotExists() {
        await DB.query(
            `CREATE TABLE IF NOT EXISTS company (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                name varchar(128),
                cif char(9) unique,
                street varchar(128),
                number int,
                postal int,
                city varchar(128),
                province varchar(128),
                createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
                updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
        )
    }

    async getAll() {
        const [res] = await DB.query("select * from company")
        return res
    }

    async getById(id) {
        const [res] = await DB.query('select * form company where ID = ?', [id])
        return res[0]
    }

    async insert(obj) {
        const query = "INSERT INTO company (name, cif, street, number, postal, city, province) values (?, ?, ?, ?, ?, ?, ?)"
        const vals = [obj.name, obj.cif, obj.street, obj.number, obj.postal, obj.city, obj.province]
        const [res] = await DB.query(query, vals)
        return res
    }

    async update(obj, id) {
        const query = "update company set name = ?, cif = ?, street = ?, number = ?, postal = ?, city = ?, province = ? where id = ?"
        const vals = [obj.name, obj.cif, obj.street, obj.number, obj.postal, obj.city, obj.province, id]
        const [res] = await DB.query(query, vals)
        return res
    }

    async delete(id) {
        const [res] = await DB.query("delete FROM company where id = ?", [id])
        return res
    }
}

module.exports = new CompanyDAO()
