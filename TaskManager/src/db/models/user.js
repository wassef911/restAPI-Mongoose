const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, lowercase: true },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain the word password.");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("E-mail is invalid.");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Age is a postive number.");
    },
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password or email problem!");
  return user;
};
// hash the plain text password before saving
userSchema.pre("save", async function (next) {
  // run code before the user is saved
  const user = this;
  console.log("just before saving!");
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
