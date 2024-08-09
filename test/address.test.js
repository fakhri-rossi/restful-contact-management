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
  createTestAddress,
  getTestAddress,
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

describe("GET /api/contacts/:contact_id/addresses/:address_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(app)
      .get(`/api/contacts/${testContact._id}/addresses/${testAddress._id}`)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.street).toBe("Jalan Test");
    expect(result.body.data.city).toBe("Kota Test");
    expect(result.body.data.province).toBe("Provinsi Test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("232323");
  });

  it("should reject if contact is not found", async () => {
    const testAddress = await getTestAddress();

    const result = await supertest(app)
      .get(`/api/contacts/hhhh/addresses/${testAddress._id}`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .get(`/api/contacts/${testContact._id}/addresses/hhh`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contact_id/addresses/:address_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(app)
      .put(`/api/contacts/${testContact._id}/addresses/${testAddress._id}`)
      .set("Authorization", "test")
      .send({
        street: "Jalan Test Update",
        city: "Kota Test Update",
        province: "Provinsi Test Update",
        country: "Finlandia",
        postal_code: "323232",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.street).toBe("Jalan Test Update");
    expect(result.body.data.city).toBe("Kota Test Update");
    expect(result.body.data.province).toBe("Provinsi Test Update");
    expect(result.body.data.country).toBe("Finlandia");
    expect(result.body.data.postal_code).toBe("323232");
  });

  it("should can reject if request is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(app)
      .put(`/api/contacts/${testContact._id}/addresses/${testAddress._id}`)
      .set("Authorization", "test")
      .send({
        street: 10,
        city: true,
        province: 3,
        country: "",
        postal_code: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });

  it("should can reject if address is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .put(`/api/contacts/${testContact._id}/addresses/wkwk`)
      .set("Authorization", "test")
      .send({
        street: "Jalan Test Update",
        city: "Kota Test Update",
        province: "Provinsi Test Update",
        country: "Finlandia",
        postal_code: "323232",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("should can reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .put(`/api/contacts/aowkwk/addresses/${testContact._id}`)
      .set("Authorization", "test")
      .send({
        street: "Jalan Test Update",
        city: "Kota Test Update",
        province: "Provinsi Test Update",
        country: "Finlandia",
        postal_code: "323232",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contact_id/addresses/:address_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can delete address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(app)
      .delete(`/api/contacts/${testContact._id}/addresses/${testAddress._id}`)
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it("should can reject if address is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(app)
      .delete(`/api/contacts/${testContact._id}/addresses/haha`)
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("should can reject if contact is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(app)
      .delete(`/api/contacts/hehehe/addresses/${testAddress._id}`)
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});
