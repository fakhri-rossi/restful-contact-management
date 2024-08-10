import mongoose from "mongoose";
import validator from "validator";
import Address from "./address.model";

const contactSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "first_name cannot be empty"],
    maxlength: [100, "char length cannot be moe than 100"],
  },
  last_name: {
    type: String,
    maxlength: [100, "char length cannot be moe than 100"],
  },
  email: {
    type: String,
    maxlength: [200, "email length cannot be moe than 200"],
    validate: [validator.isEmail, "Invalid Email format"],
  },
  phone: {
    type: String,
    maxlength: [20, "phone length cannot be moe than 20"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
});

contactSchema.post("findOneAndDelete", async (contact) => {
  if (contact.addresses.length > 0) {
    await Address.deleteMany({ _id: { $in: contact.addresses } });
  }
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
