import mongoose from "mongoose";
import { isEmail } from "validator";

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
    validate: [isEmail, "Invalid Email format"],
  },
  phone: {
    type: String,
    maxlength: [20, "phone length cannot be moe than 20"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
