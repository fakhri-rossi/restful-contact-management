import { app } from "../src/app/app.js";
import supertest from "supertest";
import {
  closeDBConnection,
  createManyTestContact,
  createTestContact,
  createTestUser,
  getTestContact,
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

describe("GET /api/contacts/:contact_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .get(`/api/contacts/${testContact._id}`)
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBe(testContact._id.toString());
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("should return 404 if contact id is not found", async () => {
    const result = await supertest(app)
      .get(`/api/contacts/66b47995a19bdd83c264d100}`)
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contact_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .put(`/api/contacts/${testContact._id}`)
      .set("Authorization", "test")
      .send({
        first_name: "Fakhri",
        last_name: "Rossi",
        email: "rossi@test.com",
        phone: "081212121212",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data._id).toBe(testContact._id.toString());
    expect(result.body.data.first_name).toBe("Fakhri");
    expect(result.body.data.last_name).toBe("Rossi");
    expect(result.body.data.email).toBe("rossi@test.com");
    expect(result.body.data.phone).toBe("081212121212");
  });

  it("should reject update if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(app)
      .put(`/api/contacts/${testContact._id}`)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "rossi",
        phone: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });

  it("should reject update if contact is not found", async () => {
    const result = await supertest(app)
      .put(`/api/contacts/heheyyyboyyy`)
      .set("Authorization", "test")
      .send({
        first_name: "Fakhri",
        last_name: "Rossi",
        email: "rossi@test.com",
        phone: "081212121212",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contact_id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can delete contact", async () => {
    let testContact = await getTestContact();

    const result = await supertest(app)
      .delete(`/api/contacts/${testContact._id}`)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it("should reject delete if contact is not found", async () => {
    const result = await supertest(app)
      .delete(`/api/contacts/wkwkwk`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search to page 2", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search using name", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .query({
        name: "test1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search using email", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search using phone", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .query({
        phone: "081234567891",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
