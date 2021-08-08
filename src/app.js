const express = require("express");
// admin bro imports
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
// swagger imports
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// codebase
require("./db/mongoosedb");
const User = require("./db/models/user");
const Task = require("./db/models/tasks");
const userRouter = require("./routers/user");
const tasksRouter = require("./routers/tasks");

// init
const app = express();
AdminBro.registerAdapter(AdminBroMongoose);

const AdminBroOptions = {
  resources: [User, Task],
  branding: {
    companyName: "Example",
  },
};
const adminBro = new AdminBro(AdminBroOptions);
const adminRouter = AdminBroExpress.buildRouter(adminBro);

// let's goooo
app.use(adminBro.options.rootPath, adminRouter);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
);
app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

module.exports = app;
