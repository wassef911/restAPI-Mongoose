const express = require("express");

require("./db/mongoosedb");
const userRouter = require("./db/routers/user");
const tasksRouter = require("./db/routers/tasks");

const app = express();
const port = process.env.PORT || 3083;

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
