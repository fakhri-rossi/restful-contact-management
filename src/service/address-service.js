import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import Contact from "../models/contact.model.js";
import { validate } from "../validation/validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { ResponseError } from "../error/response-error.js";
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/address-validation.js";
import addressTransformer from "../transformer/address-transformer.js";

const isContactExists = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const countContact = await Contact.countDocuments({
    username: user.username,
    _id: contactId,
  });

  if (countContact < 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await isContactExists(user, contactId);

  request = validate(createAddressValidation, request);
  request.contact_id = contactId;

  const addressResponse = await Address.create({
    country: request.country,
    city: request.city,
    postal_code: request.postal_code,
    province: request.province,
    street: request.street,
    contact_id: request.contact_id,
  });

  await Contact.findByIdAndUpdate(contactId, {
    $push: { addresses: addressResponse._id },
  });

  return addressTransformer(addressResponse);
};

const get = async (user, contactId, addressId) => {
  contactId = await isContactExists(user, contactId);
  addressId = validate(getAddressValidation, addressId);

  const addressResponse = await Address.findOne({
    contact_id: contactId,
    _id: addressId,
  });

  if (!addressResponse) {
    throw new ResponseError(404, "Address is not found");
  }

  return addressTransformer(addressResponse);
};

const update = async (user, contactId, request) => {
  contactId = await isContactExists(user, contactId);
  const address = validate(updateAddressValidation, request);

  const countAddress = await Address.countDocuments({
    _id: address._id,
  });

  if (countAddress < 1) {
    throw new ResponseError(404, "Address is not found");
  }

  const addressResponse = await Address.findOneAndUpdate(
    {
      _id: address._id,
    },
    {
      $set: {
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code,
      },
    },
    {
      new: true,
    }
  );

  return addressTransformer(addressResponse);
};

export default {
  create,
  get,
  update,
};
