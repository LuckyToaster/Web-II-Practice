const { configureMiddlewares, errorHandlerMiddleware } = require('./middleware')
const express = require("express")
require('dotenv').config()

const userRouter = require("../../routes/user")
const companyRouter = require('../../routes/company')
const clientRouter = require('../../routes/client')
const projectRouter = require('../../routes/project')


function startServer(app, port) {
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${server.address().port}`)
    })
    return server
}


function start() {
    const app = express()
    configureMiddlewares(app)
    app.use("/api/user", userRouter) 
    app.use('/api/company', companyRouter)
    app.use('/api/client', clientRouter)
    app.use('/api/project', projectRouter)
    app.use(errorHandlerMiddleware) 

    const server = startServer(app, process.env.PORT)
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${process.env.PORT} is already in use`)
            startServer(app, 0)
        }
    })
    return server
}


module.exports = start;
