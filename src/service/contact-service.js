import { createContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import contactTransformer from "../transformer/contact-transformer.js";

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

export default {
  create,
};
