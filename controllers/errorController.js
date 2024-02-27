const AppError = require("../utility/appError");

const handleJwtError = () => new AppError('Invalid token. Please log in again', 401);
const handleJwtExpiredError = () => new AppError('Your token has been expired. Please log in again', 401);
const handleDuplicateFieldsDB = (err) => {
    let field = Object.keys(err.keyValue)[0];
    let value = err.keyValue[field];
    let message = `${value} already exists in the system. Please try again with another ${field}`
    return new AppError(message, 409)
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

module.exports = (err, req, res, next) => {
    //console.log(err);
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = {...err};
        if (error.name === 'JsonWebTokenError') error = handleJwtError();
        if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        sendErrorProd(error, res);
    }
}