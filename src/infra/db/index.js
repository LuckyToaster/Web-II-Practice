const mysql = require("mysql2")
require('dotenv').config()

const DB = mysql.createPool({ 
    socketPath: process.env.DB_SOCK,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise()

module.exports = DB
