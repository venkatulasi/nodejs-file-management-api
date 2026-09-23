import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL,
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