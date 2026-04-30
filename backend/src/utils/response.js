const { StatusCodes } = require('http-status-codes');

const success = (res, data = null, message = 'Success', statusCode = StatusCodes.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, StatusCodes.CREATED);
};

const error = (res, message = 'Something went wrong', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, StatusCodes.NOT_FOUND);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
  return error(res, message, StatusCodes.BAD_REQUEST, errors);
};

const validationError = (res, errors) => {
  return badRequest(res, 'Validation failed', errors);
};

module.exports = { success, created, error, notFound, badRequest, validationError };
