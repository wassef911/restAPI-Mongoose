const express = require("express");
require("./db/mongoosedb");

const User = require("./db/models/user");
const Task = require("./db/models/tasks");
const app = express();
const port = process.env.PORT || 3083;

app.use(express.json());

app.post("/users", async (req, res) => {
  const user = await new User(req.body)
    .save()
    .then((suc) => {
      res.send(suc);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/tasks", async (req, res) => {
  const task = await new Task(req.body)
    .save()
    .then((succ) => {
      res.status(200).send(succ);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body); // returns an array of strings
  const allowUpdates = ["name", "email", "age"];
  for (let i in updates) {
    if (!allowUpdates.includes(updates[i])) {
      console.log(allowUpdates);
      return res.status(404).send({ error: "Invalid updates!" });
    }
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return the updated data not the old.
      runValidators: true,
    });
    if (!user) return res.status(404).send(); // if user doesn't existe.
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send();
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
