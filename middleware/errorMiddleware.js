const globalError = (err, req, res, next) => {
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(err, res)
    } else {
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