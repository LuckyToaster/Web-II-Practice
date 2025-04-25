const { configureMiddlewares, errorHandlerMiddleware } = require('./middleware')
const express = require("express")
require('dotenv').config()

const userRouter = require("../../routes/user")
const companyRouter = require('../../routes/company')


function startServer(app, port) {
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${server.address().port}`)
    })
    return server
}


function start() {
    const app = express()

    // basic middlewares
    configureMiddlewares(app)

    // add routers
    app.use("/api/user", userRouter) 
    app.use('/api/company', companyRouter)

    // set error handler middleware after the routes 
    app.use(errorHandlerMiddleware) 

    // start the server
    const server = startServer(app, process.env.PORT)

    // handle errors
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${process.env.PORT} is already in use`)
            startServer(app, 0)
        }
    })
}


module.exports = start;
