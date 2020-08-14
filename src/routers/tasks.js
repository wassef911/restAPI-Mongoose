const express = require("express");

const auth = require("../db/middleware/auth");
const { Valid, logERR, logSUCC } = require("../utils");
const Task = require("../db/models/tasks");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // add task
  try {
    const task = await new Task({ ...req.body, owner: req.user._id }).save();

    logSUCC("a user added a task.");
    return res.status(201).send(task);
  } catch (err) {
    logERR(err.message);
    return res.status(400).send({ error: err.message });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  // update task
  try {
    const updates = Object.keys(req.body);
    if (!Valid(updates, ["description", "completed"]))
      throw new Error("invalid updates on tasks !");

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send(); // if task doesn't existe.
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    logSUCC("a user updated a task by id.");
    return res.send(task);
  } catch (err) {
    logERR(err.message);
    return res.status(400).send({ error: err.message });
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

    logSUCC("a user fetched all his task.");
    return res.send(req.user.tasks);
  } catch (err) {
    logERR(err.message);
    return res.status(500).send({ error: err.message });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  // get task by id
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    logSUCC("a user fetched a task by id.");
    return res.send(task);
  } catch (err) {
    logERR(err.message);
    return res.status(500).send({ error: err.message });
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

    if (!deletedTask) throw new Error("task is not found in the DB.");

    logSUCC("task has been deleted.");
    return res.send(deletedTask);
  } catch (err) {
    logERR(err.message);
    return res.status(500).send({ error: err.message });
  }
});

module.exports = router;
