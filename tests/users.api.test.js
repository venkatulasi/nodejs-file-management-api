import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Users API", () => {
  it("should return 401 without authentication", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
  });
});
