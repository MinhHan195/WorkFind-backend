class ApiError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.errors = {
            exceptionMessage: message
        };
    }
}

module.exports = ApiError;