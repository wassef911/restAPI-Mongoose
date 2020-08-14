const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../../src/db/models/user");

const userOneID = mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: "testName1",
  email: "testEmail1@gmail.com",
  password: "45oui5!",
  age: 22,
  tokens: [
    { token: jwt.sign({ _id: userOneID.toString() }, process.env.JWT_KEY) },
  ],
};

const populateTestDB = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = { userOne, userOneID, populateTestDB };
