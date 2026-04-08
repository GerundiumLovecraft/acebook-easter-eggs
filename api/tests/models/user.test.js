require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {

  let user;
  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      account: {
        email: "someone@example.com",
        password: "password",
      },
      profile: {
        first_name: "Maker",
        last_name: "Baker",
      },
    });
  });

  it("has an email address", () => {
    expect(user.account.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    expect(user.account.password).toEqual("password");
  });

  it("has a first name", () => {
    expect(user.profile.first_name).toEqual("Maker");
  });

  it("has a last name", () => {
    expect(user.profile.last_name).toEqual("Baker");
  });

  it("has a first name", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      firstName: "John",
      lastName: "Smith"
    })
  })

  it("has a LastName", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      firstName: "John",
      lastName: "Smith"
    })
  })

  it("has a profilePic", () => {
    const user = new User ({
      email: "someone@example.com",
      password: "password",
      firstName: "John",
      lastName: "Smith",
      profilePic: "http://someprofilepic.com"
    })
  })

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });
});


/*
Refactor the current tests
it has first name
it has last name
it has profile pic url
it has empty friend_list on init
*/