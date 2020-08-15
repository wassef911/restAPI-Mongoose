const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../../src/db/models/user");
const Tasks = require("../../src/db/models/tasks");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_KEY),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Jess",
  email: "jess@example.com",
  password: "myhouse099@@",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_KEY),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: true,
  owner: userTwo._id,
};

const populateTestDB = async () => {
  await User.deleteMany();
  await Tasks.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Tasks(taskOne).save();
  await new Tasks(taskTwo).save();
  await new Tasks(taskThree).save();
};

module.exports = {
  userOneID,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  populateTestDB,
};
