const bodyParser = require("body-parser") // comes with express, no need to install it (i could import it in node interpreter)

function configureMiddlewares(app) {
    app.use(bodyParser.json())                                      // we can access json in body like this: req.body.atrribute
    app.use(bodyParser.urlencoded({ extended: true }))              // alows to get send html form data like so: req.body.username (if there is an <input name="username">
}

function errorHandlerMiddleware(err, req, res, next) {
    console.error(err.stack) 
    res.status(err.status || 500).json({ 
        status: err.status || 500, 
        message: err.message 
    })
}

module.exports = { configureMiddlewares, errorHandlerMiddleware }

