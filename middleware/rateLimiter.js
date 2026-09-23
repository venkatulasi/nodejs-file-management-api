import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export function createAuthLimiter() {
  const options = {
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  };

  if (redisClient.isReady) {
    options.store = new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: "rate-limit:auth:",
    });
  }
  return rateLimit(options);
}
let authLimiter;

export function initializeAuthLimiter() {
  authLimiter = createAuthLimiter();
}

export function authLimiterMiddleware(req, res, next) {
  return authLimiter(req, res, next);
}
