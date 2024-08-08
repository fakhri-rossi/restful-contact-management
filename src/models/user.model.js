import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username have to be filled"],
    unique: [true, "Username is already filled"],
    maxlength: 100,
  },
  name: {
    type: String,
    required: [true, "Name have to be filled"],
  },
  password: {
    type: String,
    required: [true, "Password have to be filled"],
    minlength: 6,
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
