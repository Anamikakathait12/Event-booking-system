export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isValidationError = error.name === 'ValidationError';
  const isCastError = error.name === 'CastError';
  const isDuplicateKeyError = error.code === 11000;
  const status = isValidationError || isCastError
    ? 400
    : isDuplicateKeyError
      ? 409
      : Number.isInteger(error.status)
        ? error.status
        : 500;
  const message = status >= 500
    ? 'Internal server error'
    : isValidationError
      ? 'Validation failed'
      : isCastError
        ? `Invalid value for ${error.path}.`
        : isDuplicateKeyError
          ? 'A record with this value already exists.'
          : error.message;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: message,
    ...(isValidationError && {
      details: Object.values(error.errors).map(({ path, message: detail }) => ({
        field: path,
        message: detail,
      })),
    }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
