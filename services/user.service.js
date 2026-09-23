import { AppError } from "../errors/AppErrors.js";
import bcrypt from "bcrypt";
import {
  deleteUserRefreshTokenRepository,
  getUserPasswordRepository,
  getUsersRepository,
  updateUserPasswordRepository,
} from "../repositories/user.respository.js";
import { cacheGet, cacheSet } from "./cache.service.js";
import { CACHE_CONFIG } from "../config/cache.js";

export async function getUsersService() {
  const cacheUsers = await cacheGet(CACHE_CONFIG.USERS.KEY);

  if (cacheUsers) {
    console.log("CACHE HIT");

    return {
      status: true,
      users: cacheUsers,
    };
  }

  console.log("CACHE MISS");

  const users = await getUsersRepository();

  await cacheSet(CACHE_CONFIG.USERS.KEY, users, CACHE_CONFIG.USERS.TTL_SECONDS);

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
