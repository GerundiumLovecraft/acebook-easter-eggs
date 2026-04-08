const User = require("../models/user");
const bcrypt = require("bcrypt");

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

async function getProfile(req, res) {
  const userId = req.params.id

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
  getProfile: getProfile
};

module.exports = UsersController; 
