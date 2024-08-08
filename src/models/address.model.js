import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    maxlength: [255, "Max street length is 255"],
  },
  city: {
    type: String,
    maxlength: [255, "Max city length is 255"],
  },
  province: {
    type: String,
    maxlength: [255, "Max province length is 255"],
  },
  country: {
    type: String,
    maxlength: [255, "Max country length is 255"],
    required: [true, "Country cannot be empty"],
  },
  postal_code: {
    type: String,
    maxlength: [10, "Max postal code length is 10"],
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
