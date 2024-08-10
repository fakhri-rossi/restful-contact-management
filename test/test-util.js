import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import bcrypt from "bcryptjs";
import Contact from "../src/models/contact.model.js";
import Address from "../src/models/address.model.js";
import logger from "../src/utils/logger.js";

const getTestUserId = async () => {
  const testUser = await User.findOne({ username: "test" }).select({ _id: true });
  return testUser._id;
};

export const removeTestUser = async () => {
  await User.deleteMany({ username: "test" });
};

export const createTestUser = async () => {
  await User.create({
    username: "test",
    name: "Test Example",
    password: await bcrypt.hash("secret", 10),
    token: "test",
  });
};

export const closeDBConnection = async () => {
  await mongoose.connection.close();
};

export const getTestUser = async () => {
  return await User.findOne({
    _id: await getTestUserId(),
  });
};

export const removeAllTestContacts = async () => {
  const testContactIds = await Contact.find({
    user_id: await getTestUserId(),
  }).select({ _id: true });

  await Contact.deleteMany({
    user_id: await getTestUserId(),
  });

  await User.findOneAndUpdate({ username: "test" }, { $pullAll: { contacts: testContactIds } });
};

export const createTestContact = async () => {
  const contactResult = await Contact.create({
    username: "test",
    first_name: "test",
    last_name: "test",
    email: "test@example.com",
    phone: "081234567890",
  });

  await User.findOneAndUpdate(
    {
      username: contactResult.username,
    },
    { $push: { contacts: contactResult._id } }
  );

  await Contact.findOneAndUpdate(
    {
      _id: contactResult._id,
    },
    {
      user_id: await getTestUserId(),
    }
  );
};

export const getTestContact = async () => {
  const testUserId = await getTestUserId();
  const result = await Contact.findOne({
    user_id: testUserId,
  });
  return result;
};

export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    const contactResult = await Contact.create({
      username: `test`,
      first_name: `test${i}`,
      last_name: `test${i}`,
      email: `test${i}@example.com`,
      phone: `08123456789${i}`,
    });

    await User.findOneAndUpdate(
      {
        username: contactResult.username,
      },
      { $push: { contacts: contactResult._id } }
    );

    await Contact.findOneAndUpdate(
      {
        _id: contactResult._id,
      },
      {
        user_id: await getTestUserId(),
      }
    );
  }
};

export const removeAllTestAddresses = async () => {
  const contactId = await Contact.findOne({
    user_id: await getTestUserId(),
  }).select({ _id: true });

  await Address.deleteMany({
    contact_id: contactId,
  });

  await Contact.findOneAndUpdate(
    {
      user_id: await getTestUserId(),
    },
    {
      $set: { addresses: [] },
    }
  );
};

export const createTestAddress = async () => {
  const contact = await getTestContact();
  await Address.create({
    contact_id: contact._id,
    street: "Jalan Test",
    city: "Kota Test",
    province: "Provinsi Test",
    country: "Indonesia",
    postal_code: "232323",
  });
};

export const getTestAddress = async () => {
  const contactId = await Contact.findOne({
    user_id: await getTestUserId(),
  }).select({ _id: true });

  return Address.findOne({
    contact_id: contactId,
  });
};
