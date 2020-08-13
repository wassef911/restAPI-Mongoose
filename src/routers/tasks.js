const express = require("express");

const auth = require("../db/middleware/auth");
const Valid = require("../utils");
const Task = require("../db/models/tasks");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // add task
  try {
    const task = await new Task({ ...req.body, owner: req.user._id }).save();
    return res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  // update task
  const updates = Object.keys(req.body);
  if (!Valid(updates, ["description", "completed"]))
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send(); // if task doesn't existe.
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    console.log(task);
    res.send(task);
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

router.get("/tasks", auth, async (req, res) => {
  // get tasks
  const match = req.query.completed ? { completed: "true" } : null;
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        option: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    return res.send(req.user.tasks);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  // get task by id
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    console.log(task);
    return res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  // delete task by id
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id,
      owner: req.user.id,
    });
    if (!deletedTask)
      return res.status(404).send({ error: "Task is not found in the DB . " });
    return res.send(deletedTask);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
