const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../lib/token");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("Auth Error: User not found");
    res.status(401).json({ message: "User not found" });
    return;
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    console.log("Auth Error: Passwords do not match");
    res.status(401).json({ message: "Password incorrect" });
    return;
  }

  const token = generateToken(user.id);
  res.status(201).json({ token: token, message: "OK" });
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;
