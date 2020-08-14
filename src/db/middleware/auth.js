const jwt = require("jsonwebtoken");
const { logERR, logSUCC, logINFO } = require("../../utils");

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
    logINFO("Authentication success.");
    next();
  } catch (err) {
    logERR("Authentication error!");
    return res.status(401).send({ error: err.message });
  }
};

module.exports = auth;
