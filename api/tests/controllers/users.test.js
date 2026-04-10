const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {

    // this is a helper to stop having to create and login a user for every test
  async function createUserAndLogin(overrides = {}) {
    const userData = {
      email: "bob@email.com",
      password: "mypassword",
      firstName: "Bob",
      lastName: "Smith",
      ...overrides,
    };

    await request(app).post("/users").send(userData);

    const loginResponse = await request(app)
      .post("/tokens")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const user = await User.findOne({ email: userData.email });

    return {
      user,
      token: loginResponse.body.token,
      userData,
    };
  }

    // this is a helper to stop having to create and login a user for every test
  async function createUserAndLogin(overrides = {}) {
    const userData = {
      email: "bob@email.com",
      password: "mypassword",
      firstName: "Bob",
      lastName: "Smith",
      ...overrides,
    };

    await request(app).post("/users").send(userData);

    const loginResponse = await request(app)
      .post("/tokens")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const user = await User.findOne({ email: userData.email });

    return {
      user,
      token: loginResponse.body.token,
      userData,
    };
  }


  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "1234abcd", firstName: "User", lastName: "Maker" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "1234", firstName: "User", lastName: "Maker" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });

    test("the password is hashed before being stored", async () => {
      await request(app)
        .post("/users")
        .send({ email: "sarah@email.com", password: "1234" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.password).not.toEqual("1234");
      expect(newUser.password).toMatch(/^\$2b\$/);
    });

    test("user can sign up and then log in", async () => {
      await request(app)
        .post("/users")
        .send({ email: "maria@email.com", password: "mypassword", firstName: "Maria", lastName: "Baker" });

      const response = await request(app)
        .post("/tokens")
        .send({ email: "maria@email.com", password: "mypassword", firstName: "Maria", lastName: "Baker" });

      expect(response.status).toEqual(201);
      expect(response.body.token).not.toEqual(undefined);
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(5);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(5);
    });
  });

  describe("POST, when email already exists", () => {
    test("cannot sign up with an email that already exists", async () => {
      await request(app)
        .post("/users")
        .send({ email: "duplicate@email.com", password: "1234" });

      const response = await request(app)
        .post("/users")
        .send({ email: "duplicate@email.com", password: "1234" });

      expect(response.status).toEqual(400);
    });
  });

  describe("GET /users/me", () => {
    test("returns the current user without the password", async () => {
      const { token, userData } = await createUserAndLogin({
        email: "currentuser@email.com",
        password: "1234",
        firstName: "Current",
        lastName: "User",
      });

      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toEqual(userData.email);
      expect(response.body.profile.firstName).toEqual("Current");
      expect(response.body.profile.lastName).toEqual("User");
      expect(response.body.password).toBeUndefined();
    });
  });
  describe("GET /users/:id", () => {
    test("returns a users profile without the password", async () => {
      const { user, token } = await createUserAndLogin({
        email: "profile@email.com",
        password: "1234",
        firstName: "Profile",
        lastName: "Person",
      });

      const response = await request(app)
        .get(`/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(user._id.toString());
      expect(response.body.email).toEqual("profile@email.com");
      expect(response.body.profile.firstName).toEqual("Profile");
      expect(response.body.profile.lastName).toEqual("Person");
      expect(response.body.password).toBeUndefined();
    });

    test("returns 400 for an invalid user id format", async () => {
      const { token } = await createUserAndLogin();

      const response = await request(app)
        .get("/users/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        "Invalid user ID format in URL - use a valid MongoDB ObjectId"
      );
    });

    test("returns 400 when the user does not exist", async () => {
      const { token } = await createUserAndLogin();

      const response = await request(app)
        .get("/users/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("User not found");
    });
  });
});

  describe("GET /users/me", () => {
    test("returns the current user without the password", async () => {
      const { token, userData } = await createUserAndLogin({
        email: "currentuser@email.com",
        password: "1234",
        firstName: "Current",
        lastName: "User",
      });

      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toEqual(userData.email);
      expect(response.body.profile.firstName).toEqual("Current");
      expect(response.body.profile.lastName).toEqual("User");
      expect(response.body.password).toBeUndefined();
    });
  });


