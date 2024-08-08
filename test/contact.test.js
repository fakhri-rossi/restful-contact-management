import { app } from "../src/app/app.js";
import supertest from "supertest";
import {
  closeDBConnection,
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import logger from "../src/utils/logger.js";

afterAll(async () => {
  await closeDBConnection();
});

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(app)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@example.com",
        phone: "081234567890",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@example.com");
    expect(result.body.data.phone).toBe("081234567890");
  });

  it("should reject create contact if request is not valid", async () => {
    const result = await supertest(app)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "test",
        phone:
          "08123456785555555555555555555555555555555555555555555566666666666666690",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
