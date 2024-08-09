import mongoose from "mongoose";
import User from "../src/models/user.model";
import bcrypt from "bcryptjs";
import Contact from "../src/models/contact.model";
import Address from "../src/models/address.model";
import logger from "../src/utils/logger";

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
    username: "test",
  });
};

export const removeAllTestContacts = async () => {
  const testContactIds = await Contact.find({
    username: "test",
  }).select({ _id: true });

  await Contact.deleteMany({
    username: "test",
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
};

export const getTestContact = async () => {
  return await Contact.findOne({
    username: "test",
  });
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
  }
};

export const removeAllTestAddresses = async () => {
  const testAddressIds = await Contact.find({
    username: "test",
  }).select({ addresses: true });

  for (let testAddressId of testAddressIds) {
    await Address.deleteOne({ _id: testAddressId });
  }

  await Contact.findOneAndUpdate(
    {
      username: "test",
    },
    {
      $pullAll: { addresses: testAddressIds },
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
    username: "test",
  }).select({ _id: true });

  return Address.findOne({
    contact_id: contactId,
  });
};
