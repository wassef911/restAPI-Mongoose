const express = require("express");
const tasksRouter = new express.Router();
const notValid = require("../utils");
const Task = require("../db/models/tasks");

tasksRouter.post("/tasks", async (req, res) => {
  // add task
  try {
    const task = await new Task(req.body).save();
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

tasksRouter.patch("/tasks/:id", async (req, res) => {
  // update task
  const updates = Object.keys(req.body);
  if (notValid(updates, ["description", "completed"]))
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    const task = await Task.findById(req.params.id);
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    if (!task) return res.status(404).send(); // if task doesn't existe.
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

tasksRouter.get("/tasks", async (req, res) => {
  // get tasks
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

tasksRouter.get("/tasks/:id", async (req, res) => {
  // get task by id
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send();
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

tasksRouter.delete("/tasks/:id", async (req, res) => {
  // delete task by id
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask)
      return res.status(404).send({ error: "Task is not found in the DB . " });
    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = tasksRouter;
