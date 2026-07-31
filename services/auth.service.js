import { AppError } from "../errors/AppErrors.js";
import {
  createUserRepositroy,
  getUserByEmailRepository,
} from "../respositories/auth.repository.js";
import bcrypt from "bcrypt";

export async function registerService(name, email, password) {
  const existingUser = getUserByEmailRepository(email);

  if (existingUser) {
    throw AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    name,
    email,
    password: hashedPassword,
  };

  await createUserRepositroy(userData);
}
