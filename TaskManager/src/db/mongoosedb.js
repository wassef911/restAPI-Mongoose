const mongoose = require("mongoose");
const validator = require("validator");
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  name: { type: String, required: true, trim: true, lowercase: true },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.lowercase().includes("password"))
        throw new Error("Password cannot contain the word password.");
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("E-mail is invalid.");
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

const Tasks = mongoose.model("Tasks", {
  description: { type: String, required: true, trim: true },
  completed: {
    type: Boolean,
    default: false,
  },
});
