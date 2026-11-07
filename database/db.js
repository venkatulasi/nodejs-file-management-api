import { Pool } from "pg";
import { config } from "../config/config.js";

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,

    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: true }
        : false
})

