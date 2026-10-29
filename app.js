import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/config.js";
import { pool } from "./database/db.js";
import cookieParser from "cookie-parser";
import logger from "./logger/logger.js";
import { requestLogger } from "./middleware/requestLogger.js";
import helmet from "helmet";
import cors from "cors";
import { apiLimiter, initializeAuthLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";
import { connectRedis, redisClient } from "./config/redis.js";


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }),
);
app.use(requestId);
app.use(requestLogger);

app.use(express.json({
    limit: "1mb"
}));
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);


app.use(cookieParser());

app.use(apiLimiter);

app.use(fileRoutes);
app.use("/auth",authRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);



let server;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    logger.info("Connected to PostgreSQL");

      } catch (err) {
    logger.error(`Server startup failed: ${err.message}`);
    process.exit(1);
  }

  try {
    await connectRedis();
    logger.info("Connected to Redis");
  } catch (error) {
    logger.warn(`Redis unavailable. Continuing without cache: ${error.message}`)
  }

  initializeAuthLimiter();
  
  server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

};

function closeHttpServer(){
  return new Promise((resolve, reject) => {
    if(!server){
      return resolve();
    }

    server.close((error) => {
      if(error){
        return reject(error);
      }

      resolve();
    })
  })
};

async function shutdown(signal) {
  logger.info(`${signal} recieved. Staring graceful shutdonwn.`);

  try {
    await closeHttpServer();
    logger.info("HTTP server closed");

    await pool.end();
    logger.info("PostgreSQL pool closed");

    if(redisClient.isOpen){
      await redisClient.quit();
      logger.info("Redis connection closed")
    }

    logger.info("Graceful shutdown completed");

    process.exit(0);
  } catch (error) {
    logger.error(`Graceful shutdown failes: ${error.message}`);
    process.exit(1);
  }

}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();