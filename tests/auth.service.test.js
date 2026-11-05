import { describe, it, expect, vi } from "vitest";
import bcrypt, { compare } from "bcrypt";
import { getUserForLoginRepository } from "../repositories/auth.repository.js";
import { createRefreshTokenRepository } from "../repositories/refreshToken.repository.js";

vi.mock("../repositories/auth.repository.js", () => ({
  getUserForLoginRepository: vi.fn(),
}));
vi.mock("../repositories/refreshToken.repository.js", () => ({
  createRefreshTokenRepository: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

import { loginService } from "../services/auth.service.js";

import { getUserForLoginRepository } from "../repositories/auth.repository.js";

describe("loginService", () => {
  it("should throw 401 when user does not exist", async () => {
    getUserForLoginRepository.mockResolvedValue(null);

    await expect(
      loginService("unknown@example.com", "test-password"),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      statusCode: 401,
    });
  });

  it("should throw 403 when account is inactive", async () => {
    getUserForLoginRepository.mockResolvedValue({
      id: 1,
      email: "inactive@example.com",
      is_active: false,
      password: "hashed-password",
    });

    await expect(
      loginService("inactive@example.com", "password123"),
    ).rejects.toMatchObject({
      message: "Account is inactive",
      statusCode: 403,
    });
  });

  it("should throw 401 when password is incorrect", async () => {
    getUserForLoginRepository.mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      password: "hashed-password",
      is_active: true,
      role: "admin",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginService("admin@example.com", "wrong-password"),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      statusCode: 401,
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );
  });

  it("should login successfully with valid credentials", async () => {
  getUserForLoginRepository.mockResolvedValue({
    id: 1,
    email: "admin@example.com",
    password: "hashed-password",
    is_active: true,
    role: "admin",
  });

  bcrypt.compare.mockResolvedValue(true);

  const result = await loginService(
    "admin@example.com",
    "correct-password"
  );

  expect(result).toHaveProperty("accessToken");
  expect(result).toHaveProperty("refreshToken");

  expect(typeof result.accessToken).toBe("string");
  expect(typeof result.refreshToken).toBe("string");

  expect(createRefreshTokenRepository).toHaveBeenCalledTimes(1);

  const savedToken =
    vi.mocked(createRefreshTokenRepository).mock.calls[0][0];

  expect(savedToken.userId).toBe(1);
  expect(savedToken.tokenHash).not.toBe(result.refreshToken);
  expect(savedToken.expiresAt).toBeInstanceOf(Date);
});
});
