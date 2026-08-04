import { loginService, refreshService, registerService } from "../services/auth.service.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  await registerService(name, email, password);
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
}

export async function login(req, res) {
  const {email,password} = req.body;

  const token = await loginService(email, password);
  
  res.status(200).json({
    success: true,
    token
  })
}

export async function logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;

  const { accessToken } = await refreshService(refreshToken);

  res.status(200).json({
    success: true,
    accessToken
  })
}