const express = require("express");

require("./db/mongoosedb");
const userRouter = require("./routers/user");
const tasksRouter = require("./routers/tasks");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

module.exports = app;
