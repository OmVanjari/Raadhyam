/**
 * Standardized API Response Utilities
 * 
 * Provides consistent response format across all endpoints:
 * - Success responses with optional data, message, and pagination
 * - Error responses with optional error details
 * - Helper functions for common response patterns
 */

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {*} data - Response data (object, array, or primitive)
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} extras - Additional response fields (pagination, meta, etc.)
 */
export const successResponse = (
  res,
  data = null,
  message = 'Success',
  statusCode = 200,
  extras = {}
) => {
  const response = {
    success: true,
    message
  };
  
  // Add data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  // Add pagination if provided
  if (extras.pagination) {
    response.pagination = extras.pagination;
  }
  
  // Add any additional fields
  if (extras.meta) {
    response.meta = extras.meta;
  }
  
  // Add count if data is an array
  if (Array.isArray(data)) {
    response.count = data.length;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array|string} errors - Optional error details
 * @param {string} code - Optional error code for client identification
 */
export const errorResponse = (
  res,
  message = 'An error occurred',
  statusCode = 500,
  errors = null,
  code = null
) => {
  const response = {
    success: false,
    message
  };
  
  // Add error code if provided
  if (code) {
    response.code = code;
  }
  
  // Add errors array or convert string to array
  if (errors) {
    response.errors = Array.isArray(errors) ? errors : [errors];
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Created response (201)
 * Shorthand for successful resource creation
 */
export const createdResponse = (res, data = null, message = 'Created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response (204)
 * For successful DELETE operations with no body
 */
export const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Paginated response helper
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
export const paginatedResponse = (
  res,
  data,
  pagination,
  message = 'Data retrieved successfully'
) => {
  return successResponse(res, data, message, 200, { pagination });
};

/**
 * Validation error response (400)
 * Shorthand for validation failures
 */
export const validationErrorResponse = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, 400, errors, 'VALIDATION_ERROR');
};

/**
 * Unauthorized error response (401)
 */
export const unauthorizedResponse = (res, message = 'Authentication required') => {
  return errorResponse(res, message, 401, null, 'AUTH_REQUIRED');
};

/**
 * Forbidden error response (403)
 */
export const forbiddenResponse = (res, message = 'Access denied') => {
  return errorResponse(res, message, 403, null, 'FORBIDDEN');
};

/**
 * Not found error response (404)
 */
export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404, null, 'NOT_FOUND');
};

/**
 * Conflict error response (409)
 * For duplicate resources
 */
export const conflictResponse = (res, message = 'Resource already exists') => {
  return errorResponse(res, message, 409, null, 'CONFLICT');
};

/**
 * Internal server error response (500)
 * Logs error details in development
 */
export const internalErrorResponse = (res, message = 'Internal server error', devError = null) => {
  if (process.env.NODE_ENV === 'development' && devError) {
    return errorResponse(res, message, 500, devError.message, 'INTERNAL_ERROR');
  }
  return errorResponse(res, message, 500, null, 'INTERNAL_ERROR');
};

/**
 * Success with list response
 * Includes count and optional pagination
 */
export const listResponse = (
  res,
  items,
  count = null,
  message = 'Items retrieved successfully',
  pagination = null
) => {
  const response = {
    success: true,
    message,
    data: items
  };
  
  if (count !== null) {
    response.count = count;
  }
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return res.status(200).json(response);
};

/**
 * Success with single item response
 */
export const itemResponse = (res, item, message = 'Item retrieved successfully') => {
  return successResponse(res, item, message);
};

/**
 * Success with update response
 */
export const updatedResponse = (res, item = null, message = 'Updated successfully') => {
  return successResponse(res, item, message, 200);
};

/**
 * Success with delete response
 */
export const deletedResponse = (res, message = 'Deleted successfully') => {
  return successResponse(res, null, message, 200);
};

export default {
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  internalErrorResponse,
  listResponse,
  itemResponse,
  updatedResponse,
  deletedResponse
};
