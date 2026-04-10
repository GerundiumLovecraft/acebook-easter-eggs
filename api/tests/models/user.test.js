require("../mongodb_helper");
const { default: mongoose } = require("mongoose");
const User = require("../../models/user");

describe("User model", () => {

  let user;
  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "someone@example.com",
      password: "password",
      profile: {
        firstName: "Maker",
        lastName: "Baker",
      },
    });
  });

  it("has an email address", () => {
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    expect(user.password).toEqual("password");
  });

  it("has a first name", () => {
    expect(user.profile.firstName).toEqual("Maker");
  });

  it("has a last name", () => {
    expect(user.profile.lastName).toEqual("Baker");
  });

  it("has profile_pic as undefined on init", () => {
    expect(user.profile.profilePic).toEqual("");
  });

  it("has empty friend_list on init", () => {
    expect(user.social.friendList).toEqual([]);
  });

  it("can have friends added to the friend list", () => {
    const friendID = new mongoose.Types.ObjectId();
    user.social.friendList.push(friendID);

    expect(user.social.friendList).toHaveLength(1);
    expect(user.social.friendList[0]).toEqual(friendID);
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

  it("has a first name", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      profile: {
        firstName: "John",
        lastName: "Smith"
      }
    })
    expect(user.profile.firstName).toEqual("John");
  })

  it("has a lastName", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      profile: {
        firstName: "John",
        lastName: "Smith"
      }
    })
    expect(user.profile.lastName).toEqual("Smith");
  })

  it("has a profilePic", () => {
    const user = new User ({
      email: "someone@example.com",
      password: "password",
      profile: {
        firstName: "John",
        lastName: "Smith",
        profilePic: "http://someprofilepic.com"
      }
    })
    expect(user.profile.profilePic).toEqual("http://someprofilepic.com");
  })

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
    expect(users[0].profile.firstName).toEqual("Maker");
    expect(users[0].profile.lastName).toEqual("Baker");
    expect(users[0].profile.profilePic).toEqual("");
    expect(users[0].social.friendList).toEqual([]);
  });
});