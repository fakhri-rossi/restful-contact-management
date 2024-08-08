import { ResponseError } from "../error/response-error.js";
import User from "../models/user.model.js";
import userTransformer from "../transformer/user-transformer.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcryptjs";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await User.countDocuments({
    username: user.username,
  });

  if (countUser > 0) {
    throw new ResponseError(400, "Username already exist");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const result = await User.create({
    name: user.name,
    username: user.username,
    password: user.password,
  });

  return userTransformer(result);
};

export default {
  register,
};
