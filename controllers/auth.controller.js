import { registerService } from "../services/auth.service.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  await registerService(name, email, password);
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
}
