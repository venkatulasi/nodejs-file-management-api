import multer from "multer";
import logger from "../logger/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
  });

  if(err instanceof multer.MulterError){
    if(err.code === "LIMIT_FILE_SIZE"){
      return res.status(400).json({
        success: false,
        message: "File size cannt exceeds 5 MB"
      });
    }

    return res.status(400).json({
      success:false,
      message: "File upload failed"
    })
  }
  
  const statusCode = err.statusCode || 500;

  const message = err.isOperational ? err.message : "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    message
  });
}
