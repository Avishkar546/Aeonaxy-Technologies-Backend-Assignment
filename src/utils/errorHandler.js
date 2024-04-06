class errorHandler extends Error {
    constructor(message, statusCode, errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false
        this.errors = errors;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = errorHandler;