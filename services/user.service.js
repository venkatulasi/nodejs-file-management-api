import { AppError } from "../errors/AppErrors.js";
import bcrypt from "bcrypt";
import {
  deleteUserRefreshTokenRepository,
  getUserPasswordRepository,
  getUsersRepository,
  updateUserPasswordRepository,
} from "../repositories/user.respository.js";

export async function getUsersService() {
  const users = await getUsersRepository();

  return {
    success: true,
    users,
  };
}

export async function changePasswordService(
  userId,
  currentPasswrod,
  newPassword,
) {
  const user = await getUserPasswordRepository(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPasswrod, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different with current password",
      400,
    );
  }

  const hashedPasswrod = await bcrypt.hash(newPassword, 10);

  await updateUserPasswordRepository(userId, hashedPasswrod);
  await deleteUserRefreshTokenRepository(userId);

  return true;
}
