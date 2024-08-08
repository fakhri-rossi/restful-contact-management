import supertest from "supertest";
import { app } from "../src/app/app.js";
import logger from "../src/utils/logger.js";
import {
  closeDBConnection,
  createTestUser,
  removeTestUser,
} from "./test-util.js";

afterAll(async () => {
  await closeDBConnection();
});

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(app).post("/api/users").send({
      username: "test",
      password: "secret",
      name: "Test Example",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Test Example");
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
      username: "test",
      password: "secret",
      name: "Test Example",
    });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Test Example");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(app).post("/api/users").send({
      username: "test",
      password: "secret",
      name: "Test Example",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "secret",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject login if request is invalid", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if password is wrong", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "wronggg",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject login if username is wrong", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "test12345",
      password: "secret",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(app)
      .get("/api/users/current")
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Test Example");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(app)
      .get("/api/users/current")
      .set("Authorization", "aowkwkwk");

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
