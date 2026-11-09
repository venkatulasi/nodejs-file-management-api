import { AppError } from "../errors/AppErrors.js";

export function originCheck(req, res, next) {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
  ].filter(Boolean);

  const origin = req.get("origin");

   
  if (!origin) {
    return next();
  }

  if (!allowedOrigins.includes(origin)) {
    return next(new AppError("Forbidden origin", 403));
  }

  next();
}