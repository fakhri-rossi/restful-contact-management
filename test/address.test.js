import supertest from "supertest";
import {
  createManyTestContact,
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
  removeAllTestAddresses,
  createTestContact,
  closeDBConnection,
  getTestContact,
} from "./test-util.js";
import { app } from "../src/app/app.js";
import logger from "../src/utils/logger.js";

afterAll(async () => {
  await closeDBConnection();
});

describe("POST /api/contacts/:contact_id/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .post("/api/contacts/" + testContact._id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jalan Test",
        city: "Kota Test",
        province: "Provinsi Test",
        country: "Indonesia",
        postal_code: "232323",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.street).toBe("Jalan Test");
    expect(result.body.data.city).toBe("Kota Test");
    expect(result.body.data.province).toBe("Provinsi Test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("232323");
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .post("/api/contacts/" + testContact._id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .post("/api/contacts/" + "hhhh" + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});
