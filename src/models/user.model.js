import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username have to be filled"],
    unique: [true, "Username is already filled"],
    maxlength: [100, "username cannot be more than 100 length"],
  },
  name: {
    type: String,
    required: [true, "Name have to be filled"],
    maxlength: [100, "Name cannot be more than 100 length"],
  },
  password: {
    type: String,
    required: [true, "Password have to be filled"],
    minlength: [6, "Password length cannot be less than 6"],
  },
  token: {
    type: String,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
