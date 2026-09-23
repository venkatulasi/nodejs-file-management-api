import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/config.js";
import { pool } from "./database/db.js";
import cookieParser from "cookie-parser";
import logger from "./logger/logger.js";
import { requestLogger } from "./middleware/requestLogger.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { apiLimiter, initializeAuthLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";
import { connectRedis } from "./config/redis.js";


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

app.use(errorHandler);

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
  
  app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

}

startServer();