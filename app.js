import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/requestLogger.js";
import helmet from "helmet";
import cors from "cors";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }),
);
app.use(requestId);
app.use(requestLogger);

app.use(express.json({
    limit: "1mb"
}));
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);


app.use(cookieParser());

app.use(apiLimiter);

app.use(fileRoutes);
app.use("/auth",authRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);

export default app;
