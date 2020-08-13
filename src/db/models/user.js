const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/tasks");

const userSchema = new mongoose.Schema(
  {
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

// methods to add method on user object
userSchema.methods.giveAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secret");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "owner",
});

// statics to add method on User Schema
userSchema.statics.findByCredentials = async (email, password) => {
  // method to login user by email and password
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password or email problem!");
  return user;
};

// hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  // hash the plain text password before saving
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
