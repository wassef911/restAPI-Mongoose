const request = require("supertest");

const { userOneID, userOne, populateTestDB } = require("./fixtures/db");
const app = require("../src/app");
const User = require("../src/db/models/user");

const aNewUser = {
  name: "testName2",
  email: "testEmail2@gmail.com",
  password: "test123",
  age: 21,
};

beforeEach(populateTestDB);

test("Should not login nonexisting user", async () => {
  await request(app).post("/users/login").send(aNewUser).expect(400);
});

test("Should signup a new user", async () => {
  await request(app).post("/users").send(aNewUser).expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account if authenticated", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete account if unauthenticated", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/catPicture.jpg")
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user.avatar).toEqual(expect.any(Buffer));
});
