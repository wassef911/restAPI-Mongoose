require("./mongoosedb");

const Task = require("./models/tasks");

Task.findByIdAndRemove("5f28aaaa22c7520c9dda99a4")
  .then(() => {
    return Task.find({ completed: true });
  })
  .then((nb) => {
    console.log(nb.length);
  })
  .catch((err) => {
    console.log(err);
  });
