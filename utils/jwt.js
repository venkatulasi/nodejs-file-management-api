import jwt from "jsonwebtoken";
import { requireEnv } from "../config/config.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    requireEnv("JWT_SECRET"),
    {
      expiresIn: requireEnv("JWT_ACCESS_EXPIRES_IN"),
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, requireEnv("JWT_SECRET"));
}

export function verifyRefreshToken(token){
  return jwt.verify(token, requireEnv("JWT_REFRESH_SECRET"))  
}

export function generateRefreshToken(user){

  return jwt.sign(
    {
      sub: user.id
    },
    requireEnv("JWT_REFRESH_SECRET"),
    {
      expiresIn: requireEnv("JWT_REFRESH_EXPIRES_IN")
    }
  )
}