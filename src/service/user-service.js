import { ResponseError } from "../error/response-error.js";
import User from "../models/user.model.js";
import userTransformer from "../transformer/user-transformer.js";
import logger from "../utils/logger.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcryptjs";
import { v7 as uuid } from "uuid";

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

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await User.findOne({ username: loginRequest.username });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = bcrypt.compareSync(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or passwod wrong");
  }

  const token = uuid().toString();

  return await User.findOneAndUpdate(
    { username: loginRequest.username },
    {
      $set: { token: token },
    }
  ).select({ token });
};

const get = async (username) => {
  username = validate(getUserValidation, username);

  const user = await User.findOne({ username }).select({
    name: true,
    username: true,
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }

  return user;
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const totalUserInDatabase = await User.countDocuments({
    username: user.username,
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  const result = await User.findOneAndUpdate(
    { username: user.username },
    {
      $set: { name: data.name, password: data.password },
    },
    { new: true }
  );

  return userTransformer(result);
};

export default {
  register,
  login,
  get,
  update,
};
