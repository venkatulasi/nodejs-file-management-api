import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../app.js";

describe("Health API", () => {
  it("should return 200 when the backend is alive", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });
});