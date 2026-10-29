import { Router } from "express"
import { pool } from "../database/db.js";
import { redisClient } from "../config/redis.js";

const router = Router();

router.get("/live", (req, res)=> {
    return res.status(200).json({
        status:"ok"
    })
})

router.get("/ready", async (req, res)=>{
    try {
        await pool.query("SELECT 1");

        const redisReady = redisClient.isReady;

        return res.status(200).json({
            status: redisReady ? "ready" : "degraded",
            services: {
                postgres: "up",
                redis: redisReady ? "up" : "down"
            }
        })
    } catch (error) {
        console.error("REDINESS PostgreSQL error: ",error.message);
        
        return res.status(503).json({
            status: "not_ready",
            services: {
                postgres: "down",
                redis: redisClient.isReady ? "up" : "down"
            }
        })
        
    }
})

export default router;