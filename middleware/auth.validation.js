import { AppError } from "../errors/AppErrors.js";

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (!email.trim()) {
    throw new AppError("Email is required", 400);
  }

  if (!password || password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email?.trim()) {
    throw new AppError("Email is required", 400);
  }

  if (!password) {
    throw new AppError("Passwrod is required", 400);
  }

  next();
}

export function validateRefresh(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }
  next();
}
