const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectToDatabase } = require("../db/db");
const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");

const rawUsers = [
  { email: "alice.johnson@example.com", password: "Password1!", firstName: "Alice", lastName: "Johnson" },
  { email: "bob.smith@example.com",     password: "Password2!", firstName: "Bob",   lastName: "Smith"   },
  { email: "carol.white@example.com",   password: "Password3!", firstName: "Carol", lastName: "White"   },
  { email: "david.brown@example.com",   password: "Password4!", firstName: "David", lastName: "Brown"   },
  { email: "eve.davis@example.com",     password: "Password5!", firstName: "Eve",   lastName: "Davis"   },
];

const friendRequestPairs = [
  [0, 1], // Alice  → Bob
  [0, 2], // Alice  → Carol
  [1, 3], // Bob    → David
  [2, 4], // Carol  → Eve
  [3, 0], // David  → Alice
];

let seededUsers = [];
let seededRequests = [];

beforeAll(async () => {
  await connectToDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
  await FriendRequest.deleteMany({});

  const usersToInsert = await Promise.all(
    rawUsers.map(async ({ email, password, firstName, lastName }) => ({
      email,
      password: await bcrypt.hash(password, 10),
      profile: { firstName, lastName },
    }))
  );

  seededUsers = await User.insertMany(usersToInsert);

  seededRequests = await FriendRequest.insertMany(
    friendRequestPairs.map(([fromIdx, toIdx]) => ({
      from: seededUsers[fromIdx]._id,
      to: seededUsers[toIdx]._id,
    }))
  );
});

afterEach(async () => {
  await FriendRequest.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close(true);
});

module.exports = { 
  seededUsers: () => seededUsers,
  seededRequests: () => seededRequests
};