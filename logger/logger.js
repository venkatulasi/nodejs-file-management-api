import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  firmat: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/app.log"
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    })

  ]
});

export default logger;