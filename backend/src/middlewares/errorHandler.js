const { StatusCodes } = require('http-status-codes');
const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Sequelize Validation Error
  if (err instanceof ValidationError) {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  // Sequelize Unique Constraint
  if (err instanceof UniqueConstraintError) {
    const field = err.errors?.[0]?.path || 'field';
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Sequelize DB Error
  if (err instanceof DatabaseError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Database error occurred',
    });
  }

  // Express-validator errors forwarded manually
  if (err.isValidation) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Default
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
