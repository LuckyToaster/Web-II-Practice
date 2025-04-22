class AppError extends Error {
    constructor(message, status, name) {
        super(message)
        this.status = status
        this.name = name
    }
}

class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400, 'Bad Request')
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401, 'Unauthorized')
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403, 'Forbidden')
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'Not Found')
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 422, 'Validation Error / Unprocessable Content')
    }
}

class InternalServerError extends AppError {
    constructor(message) {
        super(message, 500, 'Internal Server Error')
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'Conflict Error')
    }
}

class BusinessError extends AppError {
    constructor(message) {
        super(message, 0, 'Business Error')
    }
}


module.exports = { 
    BadRequestError, 
    UnauthorizedError, 
    ForbiddenError, 
    NotFoundError, 
    ValidationError, 
    InternalServerError,
    ConflictError,
    BusinessError
}
