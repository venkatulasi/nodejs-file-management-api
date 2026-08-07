import { AppError } from "../errors/AppErrors.js";
import {
  createUserRepositroy,
  getUserByEmailRepository,
  getUserForLoginRepository,
} from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import ms from "ms";
import {
  createRefreshTokenRepository,
  deleteRefreshTokenRepository,
  getRefreshTokenRepository,
  getUserByIdRepository,
} from "../repositories/refreshToken.repository.js";
import { pool } from "../database/db.js";

export async function registerService(name, email, password) {
  const existingUser = await getUserByEmailRepository(email);

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

export async function loginService(email, password) {
  const user = await getUserForLoginRepository(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.is_active) {
    throw new AppError("Account is inactive", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const expiresAt = new Date(
    Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN),
  );

  await createRefreshTokenRepository({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshService(refreshToken) {
  const { sub } = verifyRefreshToken(refreshToken);

  const storedToken = await getRefreshTokenRepository(refreshToken);

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (new Date() > storedToken.expires_at) {
    throw new AppError("Refresh token expired. Please login again", 401);
  }
  
  const user = await getUserByIdRepository(sub);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.is_active) {
    throw new AppError("Account is inactive", 403);
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  
  //Expiry Check
  const expiresAt = new Date(
    Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN),
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await deleteRefreshTokenRepository(refreshToken, client);

    await createRefreshTokenRepository(
      {
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
      },
      client,
    );

    await client.query("COMMIT");

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function logoutService(refreshToken) {
  
  if(!refreshToken){
    return;
  }

  await deleteRefreshTokenRepository(refreshToken)
}

