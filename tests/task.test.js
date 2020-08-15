const request = require("supertest");

const {
  userOneID,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  populateTestDB,
} = require("./fixtures/db");
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

test("Should fetch user tasks", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(res.body).toHaveLength(2);
});

test("Should not delete other users tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Tasks.findById(taskOne._id);
  expect(task).not.toBeNull();
});
