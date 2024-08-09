import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import Contact from "../models/contact.model.js";
import { validate } from "../validation/validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation } from "../validation/address-validation.js";
import addressTransformer from "../transformer/address-transformer.js";

const create = async (user, contactId, request) => {
  contactId = validate(getContactValidation, contactId);

  const countContact = await Contact.countDocuments({
    username: user.username,
    _id: contactId,
  });

  if (countContact < 1) {
    throw new ResponseError(404, "Contact is not found");
  }

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

export default {
  create,
};
