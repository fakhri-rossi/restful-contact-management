import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
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
  });

  await User.findOneAndUpdate(
    { user_id: user._id },
    {
      $push: { contacts: resultContact._id },
    }
  );

  return contactTransformer(resultContact);
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await Contact.findOne({
    user_id: user._id,
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
    user_id: user._id,
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
    user_id: user._id,
    _id: contactId,
  });

  if (countContactInDatabase < 0) {
    throw new ResponseError(404, "Contact is not found");
  }

  await Contact.findOneAndDelete({ _id: contactId });

  await User.findOneAndUpdate(
    {
      username: user.username,
    },
    {
      $pull: { contacts: contactId },
    }
  );
};

const search = async (user, request) => {
  request = validate(searchContactValidation, request);

  // 1 -> (page - 1) * size = 0
  // 2 -> (page - 1) * size = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  filters.push({
    user_id: user._id,
  });

  if (request.name) {
    filters.push({
      $or: [
        {
          first_name: { $regex: new RegExp(request.name) },
        },
        {
          last_name: { $regex: new RegExp(request.name) },
        },
      ],
    });
  }

  if (request.email) {
    filters.push({
      email: { $regex: new RegExp(request.email) },
    });
  }

  if (request.phone) {
    filters.push({
      phone: { $regex: new RegExp(request.phone) },
    });
  }

  const contacts = await Contact.find({
    $and: filters,
  })
    .skip(skip)
    .limit(request.size);

  const totalItems = await Contact.countDocuments({
    $and: filters,
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};
