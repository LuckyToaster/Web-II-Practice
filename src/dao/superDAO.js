class SuperDAO {

    getSelectQueryData(obj, tableName) {
        const [cols, vals] = SuperDAO.#getColsAndVals(obj)
        let query = [`select * from ${tableName} where `]
        cols.forEach(c => query.push(`${c} = ?, `))
        SuperDAO.#removeTrailingComaAndSpace(query)
        return [query.join(''), vals]
    }

    getDeleteQueryData(obj, tableName) {
        const [cols, vals] = SuperDAO.#getColsAndVals(obj)
        let query = [`delete from ${tableName} where `]
        cols.forEach(c => query.push(`${c} = ?, `))
        SuperDAO.#removeTrailingComaAndSpace(query)
        return [query.join(''), vals]
    }

    getUpdateQueryData(obj, tableName) {
        const [cols, vals] = SuperDAO.#getColsAndVals(obj)
        let query = [`update ${tableName} set `]
        cols.forEach(c => query.push(`${c} = ?, `))
        SuperDAO.#removeTrailingComaAndSpace(query)
        query.push(' where id = ?')
        return [query.join(''), vals]
    }

    getInsertQueryData(obj, tableName) {
        const [cols, vals] = SuperDAO.#getColsAndVals(obj)
        let query = [`insert into ${tableName} (`]
        cols.forEach(c => query.push(`${c}, `))
        SuperDAO.#removeTrailingComaAndSpace(query)
        query.push(') values (')
        cols.forEach(_ => query.push('?, '))
        SuperDAO.#removeTrailingComaAndSpace(query)
        query.push(')')
        return [query.join(''), vals]
    }

    static #getColsAndVals(obj) {
        let cols = Object.keys(obj).map(k => obj[k] != null? k : null).filter(k => k != null).sort()
        const idIdx = cols.findIndex(k => k === 'id') 
        if (idIdx != -1) cols.splice(idIdx, 1) 
        const vals = cols.map(c => obj[c]).concat(obj.id)
        return [cols, vals]
    }

    static #removeTrailingComaAndSpace(strArr) {
        const lastIdx = strArr.length - 1
        strArr[lastIdx] = strArr[lastIdx].replace(', ', '')
    }
}

module.exports = SuperDAO
