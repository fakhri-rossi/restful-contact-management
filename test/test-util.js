import mongoose from "mongoose";
import User from "../src/models/user.model";
import bcrypt from "bcryptjs";

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
