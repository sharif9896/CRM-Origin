const ApiError = require("../utils/ApiError");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  error.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== 'test' && (!err.statusCode || err.statusCode >= 500)) console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ApiError(`Resource not found with id of ${err.value}`, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = new ApiError(`Duplicate value entered for field: ${field}`, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(message, 400);
  }

  // Invalid JWT
  if (err.name === "JsonWebTokenError") {
    error = new ApiError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError("Your session has expired. Please log in again.", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
