const express = require("express");
const multer = require("multer");

const User = require("../models/user");
const auth = require("../middleware/auth");
const Valid = require("../../utils");

const router = new express.Router();
const upload = multer({
  dest: "avatars",
});

router.get("/users/me", auth, async (req, res) => {
  // get user profile
  res.send(req.user);
});

router.post("/users", async (req, res) => {
  // add user
  const user = await new User(req.body);
  const token = await user.giveAuthToken();
  try {
    await user.save();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  // login user
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.giveAuthToken();
    console.log("user logged in.");
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    console.log("user logged out.");
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  // logout from all accounts
  try {
    req.user.tokens = [];
    await req.user.save();
    console.log("user logged out all accounts.");
    return res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  // update user
  const updates = Object.keys(req.body);
  if (!Valid(updates, ["name", "age", "password"]))
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  // delete account
  try {
    await req.user.remove();
    return res.send(req.user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
  res.send();
});

module.exports = router;
