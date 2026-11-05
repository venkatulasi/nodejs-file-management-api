
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

import app from "../app.js";
import {
      initializeAuthLimiter,
} from "../middleware/rateLimiter.js";

describe("Authentication API", () => {
  beforeAll(() => {
    initializeAuthLimiter();
  });

  it("should reject login with missing credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({});

    expect(response.status).toBe(400);
  });
});