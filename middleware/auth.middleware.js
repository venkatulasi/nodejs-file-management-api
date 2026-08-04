import { AppError } from "../errors/AppErrors.js";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Authorization header is missing", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (!scheme || !token) {
    throw new AppError("Invalid Authorization format", 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token has expired", 401);
    }

    throw new AppError("Invalid or expired token", 401);
  }
}
