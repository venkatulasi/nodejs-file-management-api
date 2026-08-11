import ms from "ms";
import {
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "../services/auth.service.js";
import { AppError } from "../errors/AppErrors.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  await registerService(name, email, password);
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginService(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  await logoutService(refreshToken);

  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict"
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token is missing", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshService(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,    
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
}
