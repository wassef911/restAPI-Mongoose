const mongoose = require("mongoose");
const Tasks = mongoose.model("Tasks", {
  description: { type: String, required: true, trim: true },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});
module.exports = Tasks;
