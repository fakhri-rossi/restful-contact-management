import supertest from "supertest";
import { app } from "../src/app/app.js";
import User from "../src/models/user.model.js";
import mongoose from "mongoose";
import logger from "../src/utils/logger.js";

describe("POST /api/users", () => {
  afterEach(async () => {
    await User.deleteMany({ username: "rossi" });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should can register new user", async () => {
    const result = await supertest(app).post("/api/users").send({
      username: "rossi",
      password: "secret",
      name: "Fakhri Rossi",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rossi");
    expect(result.body.data.name).toBe("Fakhri Rossi");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject register if request is invalid", async () => {
    const result = await supertest(app).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject register if username already registered", async () => {
    let result = await supertest(app).post("/api/users").send({
      username: "rossi",
      password: "secret",
      name: "Fakhri Rossi",
    });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rossi");
    expect(result.body.data.name).toBe("Fakhri Rossi");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(app).post("/api/users").send({
      username: "rossi",
      password: "secret",
      name: "Fakhri Rossi",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
