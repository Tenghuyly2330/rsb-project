const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value`;
    error = new ErrorResponse(message, 409);
  }

  // jwt error
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Not authorized to access this route', 401);
  }

  // jwt expired error
  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Token has expired. Please login again', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;