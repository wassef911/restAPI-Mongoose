const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");

const User = require("../models/user");
const auth = require("../middleware/auth");
const Valid = require("../../utils");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");

const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 1000000, // size in MB
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image."));
    }
    cb(undefined, true);
  },
});

router.get("/users/:id/avatar", async (req, res) => {
  // serve profile pictures
  try {
    const user = await User.findById(req.params.id);

    if (!user) throw new Error("There is no such user.");
    if (!user.avatar) throw new Error("This user has no avatar");

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (err) {
    return res.status(404).send({ error: err.message });
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  // delete profile picture
  try {
    req.user.avatar = undefined;
    await req.user.save();
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

router.post("/users/me/avatar", upload.single("avatar"), async (req, res) => {
  // upload profile picture
  try {
    // auth without the middleware
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    let user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("Please Authenticate.");

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    user.avatar = buffer;
    await user.save();
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  // get user profile
  res.send(req.user);
});

router.post("/users", async (req, res) => {
  // create new user
  try {
    const user = await new User(req.body);
    const token = await user.giveAuthToken();
    await user.save();
    sendWelcomeEmail(user.name, user.email);
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
  // logout user
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
    sendCancelEmail(req.user.name, req.user.email);
    return res.send(req.user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
