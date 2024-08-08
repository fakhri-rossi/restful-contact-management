import mongoose from "mongoose";
import User from "../src/models/user.model";
import bcrypt from "bcryptjs";
import Contact from "../src/models/contact.model";

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
  await Contact.deleteMany({
    username: "test",
  });
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
