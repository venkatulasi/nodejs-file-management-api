import { createClient } from "redis";
import { AppError } from "../errors/AppErrors.js";

const redisUrl = process.env.REDIS_URL;

export const redisClient = createClient({
  url: redisUrl || "redis://127.0.0.1:6379",
  socket: {
    reconnectStrategy: false,
    connectTimeout: 3000,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

export async function connectRedis() {
  if (!redisUrl) {
    throw new AppError("REDIS_RUL is not configured")
  }

  try {
    await redisClient.connect();
    return redisClient.isReady;
  } catch (error) {
    console.warn(`Redis unavailable: ${error.message}`);
    return false;
  }
}