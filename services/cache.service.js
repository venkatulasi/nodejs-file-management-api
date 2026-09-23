import { redisClient } from "../config/redis.js";
import logger from "../logger/logger.js";

export async function cacheGet(key) {
  if (!redisClient.isReady) {
    return null;
  }

  try {
    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    logger.warn(`Cache GET failed: ${error.message}`);
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds) {
  if (!redisClient.isReady) {
    return null;
  }

  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    logger.warn(`Cache SET failed: ${error.message}`);
  }
}

export async function cacheDelete(key) {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.del(key);
  } catch (error) {
    logger.warn(`Cache DELETE failed: ${error.message}`);
  }
}
