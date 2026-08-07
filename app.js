import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/config.js";
import { pool } from "./database/db.js";
import cookieParser from "cookie-parser";
import logger from "./logger/logger.js";
import { requestLogger } from "./middleware/requestLogger.js";


const app = express();

app.use(requestLogger);

app.use(express.json());
app.use(cookieParser());


app.use(fileRoutes);
app.use("/auth",authRoutes);

app.use(errorHandler);

pool.connect().then(() => {
    logger.info("Connected to PostgreSQL")   
})
.catch((err)=>{
    logger.error(`Database connection failed: ${err.message}`);
    
})

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
});
