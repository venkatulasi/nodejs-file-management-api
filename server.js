import app from "./app.js";

import { config } from "./config/config.js";
import { pool } from "./database/db.js";
import { connectRedis, redisClient } from "./config/redis.js";
import { initializeAuthLimiter } from "./middleware/rateLimiter.js";
import logger from "./logger/logger.js";


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