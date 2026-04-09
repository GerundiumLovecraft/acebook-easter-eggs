const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

async function create(req, res) {
const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email: email, 
      password: hashedPassword, 
      profile: {firstName, lastName} 
    });
    await user.save();
    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Something went wrong" })
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error fetching current user" });
  }
}

async function getProfile(req, res) {
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format in URL - use a valid MongoDB ObjectId" });
  }

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({message: "User not found"});
    }
    res.status(200).json(user);
  } catch(err) {
    console.log(err);
    res.status(400).json({message: "Error fetching profile"})
  }
}

const UsersController = {
  create: create,
  getCurrentUser: getCurrentUser,
  getProfile: getProfile
};

module.exports = UsersController; 
