import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/config.js";
import { logger } from "./middleware/logger.js";
import { pool } from "./database/db.js";

const app = express();

app.use(logger);

app.use(express.json());

app.use(fileRoutes);
app.use("/auth",authRoutes);

app.use(errorHandler);

pool.connect().then(() => {
    console.log("Connected to PostgreSQL");    
})
.catch((err)=>{
    console.log("Database connection failsed");
    console.log(err);
    
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
