const DB = require('../db')
const userDao = require('../dao/userDAO')
const User = require('../business/user')

async function register(req) {
    const user = new User(req.body.email, req.body.password) // validates
    user.password = bcrypt.hash(user.password, 10)
    userDao.insert(user)
    // generate jwt
}


async function validate() {
    
}


async function login() {

}

module.exports = { register, validate, login }
