const ApiError = require('../utils/apiError');

// handle jwt token error 
const handleJwtTokenError = () => {
    let message = 'Token is invalid or expired'
    return new ApiError(message, 401)
}

// handle jwt token expired error 
const handleJwtTokenExpiredError = () => {
    let message = 'Token is expired'
    return new ApiError(message, 401)
}


const globalError = (err, req, res, next) => {
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(err, res)
    } else {
        if (err.name === 'JsonWebTokenError') { err = handleJwtTokenError() }
        if (err.name === 'TokenExpiredError') { err = handleJwtTokenExpiredError() }

        sendErrorForProduction(err, res)
    }
}

const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode || 500).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}
const sendErrorForProduction = (err, res) => {
    return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
    });
}
module.exports = globalError;