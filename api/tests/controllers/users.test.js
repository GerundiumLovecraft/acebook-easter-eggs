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
  describe("PATCH /users/me", () => {
  test("updates a single field for the current user", async () => {
    const { token, user } = await createUserAndLogin({
      email: "updateone@email.com",
      password: "1234",
      firstName: "Bob",
      lastName: "Smith",
    });

    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Robert" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("User updated successfully");
    expect(response.body.user.email).toEqual("updateone@email.com");
    expect(response.body.user.profile.firstName).toEqual("Robert");
    expect(response.body.user.profile.lastName).toEqual("Smith");
    expect(response.body.user.password).toBeUndefined();

    const updatedUserInDb = await User.findById(user._id);
    expect(updatedUserInDb.profile.firstName).toEqual("Robert");
    expect(updatedUserInDb.profile.lastName).toEqual("Smith");
  });

  test("updates multiple fields for the current user", async () => {
    const { token, user } = await createUserAndLogin({
      email: "updatemany@email.com",
      password: "1234",
      firstName: "Bob",
      lastName: "Smith",
    });

    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "updated@email.com",
        firstName: "Robert",
        lastName: "Jones",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("User updated successfully");
    expect(response.body.user.email).toEqual("updated@email.com");
    expect(response.body.user.profile.firstName).toEqual("Robert");
    expect(response.body.user.profile.lastName).toEqual("Jones");
    expect(response.body.user.password).toBeUndefined();

    const updatedUserInDb = await User.findById(user._id);
    expect(updatedUserInDb.email).toEqual("updated@email.com");
    expect(updatedUserInDb.profile.firstName).toEqual("Robert");
    expect(updatedUserInDb.profile.lastName).toEqual("Jones");
  });

  test("returns 400 when no valid fields are provided", async () => {
    const { token } = await createUserAndLogin({
      email: "novalidfields@email.com",
      password: "1234",
    });

    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ favouriteColour: "blue" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("No valid fields provided to update");
  });

  test("returns 400 when trying to update email to one that already exists", async () => {
    await createUserAndLogin({
      email: "existing@email.com",
      password: "1234",
      firstName: "Existing",
      lastName: "User",
    });

    const { token } = await createUserAndLogin({
      email: "second@email.com",
      password: "1234",
      firstName: "Second",
      lastName: "User",
    });

    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "existing@email.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Email already in use");
  });
});
});


