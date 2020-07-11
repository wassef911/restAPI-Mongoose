const path = require("path");

const express = require("express");
const app = express();

const build = path.join(__dirname, "../public");

app.use(express.static(build));

app.listen(3000, () => {
  console.log("server is up on port 3000.");
});
