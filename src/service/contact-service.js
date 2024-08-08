import {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import contactTransformer from "../transformer/contact-transformer.js";
import { ResponseError } from "../error/response-error.js";
import logger from "../utils/logger.js";

const create = async (user, request) => {
  const contact = validate(createContactValidation, request);

  const resultContact = await Contact.create({
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
    user_id: user._id,
    username: user.username,
  });

  await User.findOneAndUpdate(
    { username: user.username },
    {
      $push: { contacts: resultContact._id },
    }
  );

  return contactTransformer(resultContact);
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await Contact.findOne({
    username: user.username,
    _id: contactId,
  });

  if (!contact) {
    throw new ResponseError(404, "Contact is not found");
  }

  return contactTransformer(contact);
};

const update = async (user, request) => {
  const contact = validate(updateContactValidation, request);

  const countContactInDatabase = await Contact.countDocuments({
    username: user.username,
    _id: contact._id,
  });

  if (countContactInDatabase < 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  const contactResponse = await Contact.findOneAndUpdate(
    {
      _id: contact._id,
    },
    {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    {
      new: true,
    }
  );

  return contactTransformer(contactResponse);
};

const remove = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const countContactInDatabase = await Contact.findOne({
    username: user.username,
    _id: contactId,
  });

  if (countContactInDatabase < 0) {
    throw new ResponseError(404, "Contact is not found");
  }

  await Contact.deleteOne({
    _id: contactId,
  });

  await User.findOneAndUpdate(
    {
      username: user.username,
    },
    {
      $pull: { contacts: contactId },
    }
  );
};

export default {
  create,
  get,
  update,
  remove,
};
