// Gloabl Error handling middleware

const AppError = require("../utils/appError");

//Function to handle invalid request from database like invalid id 
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 404);
}


const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message =`Duplicate field value: ${value}. Please use another value.`
  return new AppError(message, 400);
}

const handleValidationErroDB =(err) => {
  const error = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data ${error.join('. ')}`;
  return new AppError(message, 400);
}

const handleJwtError = () => new AppError('Invalid token. Please login again', 401)

const handleJwtExpiredError = () => new AppError('Your token has expired. Please login again.', 401)

// response of error in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.status
  })
}

// response of error in production mode
const sendErrorProd = (err, res) => {

  // Operational , trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
  // Programming or other unknown error: dont leak error details
  console.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }

  
}

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res)
    } else if(process.env.NODE_ENV === 'production') {
      let error = { ...err};

      if(error.name === 'CastError') 
        error = handleCastErrorDB(error)
      if(error.code === 1100) 
        error = handleDuplicateFieldsDB(error)
      if(error.name === 'ValidationErro')
        error = handleValidationErroDB(error);
      if(error.name === 'JsonWebTokenErro')
        error = handleJwtError()
      if(error.name == 'TokenExpiredError')
        error = handleJwtExpiredError()
      sendErrorProd(error, res)
    }
    
  }