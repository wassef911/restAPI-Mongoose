const express = require("express");

const auth = require("../middleware/auth");
const Valid = require("../../utils");
const Task = require("../models/tasks");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // add task
  try {
    const task = await new Task({ ...req.body, owner: req.user._id }).save();
    res.status(200).send(task);
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
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  // get task by id
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    console.log(task);
    res.send(task);
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
    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
