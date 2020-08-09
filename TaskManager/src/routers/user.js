const express = require("express");
const User = require("../db/models/user");
const router = new express.Router();
const notValid = require("../utils");

router.get("/users", async (req, res) => {
  // get users
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users", async (req, res) => {
  // add user
  try {
    const user = await new User(req.body).save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  // add user
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/users/:id", async (req, res) => {
  // update user
  const updates = Object.keys(req.body);
  if (notValid(updates, ["name", "age", "password"]))
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    /*
   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return the updated data not the old.
      runValidators: true,
    });
   */
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    if (!user) return res.status(404).send(); // if user doesn't existe.
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/users/:id", async (req, res) => {
  // get user by id
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/:id", async (req, res) => {
  // delete user by id
  const _id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser)
      return res.status(404).send({ error: "User is not found in the DB . " });
    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
