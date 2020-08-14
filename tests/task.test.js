const request = require("supertest");

const { userOneID, userOne, populateTestDB } = require("./fixtures/db");
const app = require("../src/app");
const Tasks = require("../src/db/models/tasks");

beforeEach(populateTestDB);

test("Should create task for user", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "From test suit." })
    .expect(201);
  const task = await Tasks.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});
