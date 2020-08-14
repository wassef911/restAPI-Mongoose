const jwt = require("jsonwebtoken");

const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("Please Authenticate.");
    req.user = user;
    req.token = token;
    console.log("Authentication success.");
    next();
  } catch (err) {
    return res.status(401).send({ error: err.message });
  }
};

module.exports = auth;
