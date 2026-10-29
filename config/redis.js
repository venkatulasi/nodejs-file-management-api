import { createClient } from "redis";
import { requireEnv } from "./config.js";

export const redisClient = createClient({
    url: requireEnv("REDIS_URL"),
    socket:{
        reconnectStrategy:false
    }
});

redisClient.on("error",(err)=>{
    console.error("Redis Client Error",err);
});

export async function connectRedis() {
    await redisClient.connect();
}