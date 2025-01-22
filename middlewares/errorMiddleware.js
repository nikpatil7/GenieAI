const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  
  // Copy message and statusCode
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log the complete error for debugging
  console.log('Full error object:', {
    originalError: err,
    processedError: error,
    name: err.name,
    code: err.code
  });

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    error = new ErrorResponse(`${field} '${value}' is already registered`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Mongoose CastError
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ErrorResponse(message, 400);
  }

  // Send the error response
  return res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    error: {
      statusCode: error.statusCode,
      message: error.message || 'Server Error'
    }
  });
}; 

module.exports = errorHandler;