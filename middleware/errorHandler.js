import logger from "../logger/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
  });

  const statusCode = err.statusCode || 500;

  const message = err.isOperational ? err.message : "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    message
  });
}
