/**
 * Centralized Error Handling Middleware
 * 
 * Features:
 * - Custom error classes for standard HTTP errors
 * - Async error wrapper to catch promise rejections
 * - Standardized error response format
 * - MongoDB error handling (duplicate keys, validation, etc.)
 * - Safe error logging (no sensitive data exposure)
 */

import mongoose from 'mongoose';

/**
 * Custom Application Error class
 * Extends built-in Error with HTTP status codes and error codes
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  // Factory methods for common errors
  static badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }
  
  static unauthorized(message = 'Unauthorized', code = 'AUTH_REQUIRED') {
    return new AppError(message, 401, code);
  }
  
  static forbidden(message = 'Access denied', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }
  
  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }
  
  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }
  
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new AppError(message, 500, code);
  }
}

/**
 * Async wrapper to catch errors in async route handlers
 * Eliminates need for try-catch in every controller
 * 
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle MongoDB duplicate key errors
 * Returns 409 Conflict with field-specific message
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern || {})[0] || 'field';
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  return new AppError(message, 409, 'DUPLICATE_KEY');
};

/**
 * Handle MongoDB validation errors
 * Returns 400 Bad Request with detailed error messages
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map(e => e.message);
  const message = errors.length > 0 ? errors.join(', ') : 'Validation failed';
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Handle MongoDB CastError (invalid ObjectId)
 * Returns 400 Bad Request for invalid ID format
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
};

/**
 * Handle JWT expiration
 */
const handleJWTExpiredError = () => {
  return new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
};

/**
 * Development error response - includes stack trace
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    code: err.code,
    errors: err.errors,
    stack: err.stack,
    path: err.path,
    method: err.method
  });
};

/**
 * Production error response - minimal info, no stack trace
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
  } else {
    // Programming or unknown errors: don't leak error details
    console.error('UNKNOWN ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Global error handling middleware
 * Must be registered AFTER all routes
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_ERROR';
  
  // Clone error to avoid mutation
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;
  error.errors = err.errors;
  
  // Handle specific error types
  if (error.name === 'CastError') {
    error = handleCastError(error);
  }
  
  if (error.code === 11000) {
    error = handleDuplicateKeyError(error);
  }
  
  if (error.name === 'ValidationError') {
    error = handleValidationError(error);
  }
  
  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Not Found (404) handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

/**
 * Validate MongoDB ObjectId
 * Returns AppError for invalid IDs
 */
export const validateObjectId = (id, fieldName = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`Invalid ${fieldName} format`, 'INVALID_ID');
  }
};

/**
 * Safe error logger
 * Logs errors without exposing sensitive information
 */
export const logError = (err, req = {}, context = '') => {
  const logData = {
    timestamp: new Date().toISOString(),
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    path: req?.path,
    method: req?.method,
    ip: req?.ip,
    context
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', logData, '\nStack:', err.stack);
  } else {
    console.error('ERROR:', JSON.stringify(logData));
  }
};

export default {
  AppError,
  asyncHandler,
  globalErrorHandler,
  notFoundHandler,
  validateObjectId,
  logError
};
