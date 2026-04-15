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
    res.status(201).json({ message: "OK" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" })
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user_id).select("-password");;

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
};

async function updateCurrentUser(req, res) {
  try {
      const fieldMap = {
        email: "email",
        firstName: "profile.firstName",
        lastName: "profile.lastName",
        bio: "profile.bio",
        profilePic: "profile.profilePic",
      };

      const updates = {};

      Object.entries(fieldMap).forEach(([bodyField, dbField]) => {
        if (req.body[bodyField] !== undefined) {
          updates[dbField] = req.body[bodyField];
        }
      });

        if (Object.keys(updates).length === 0) {
          return res.status(400).json({ message: "No valid fields provided to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
          req.user_id,
          { $set: updates }, //$set updates/adds a field if it doesnt exist
          { returnDocument: "after", runValidators: true } // validators make sure you cant update a field that doesnt match the schema
        ).select("-password")

    return res.status(200).json({message: "User updated successfully", user: updatedUser})
  } catch (error) {
    console.log(error)

      if (error.code === 11000) { //11000 is a mongoDb dupe key/email error
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

async function searchUser(req, res) {
  try {
    // Turn search string into a regex object
    const partialNameRegex = new RegExp(req.query.name, "i");
    // Look for 3 matching users
    const matchingUsers = await User
      .find({$or: [{'profile.firstName': partialNameRegex}, {'profile.lastName': partialNameRegex}]})
      .select("_id profile.firstName profile.lastName profile.profilePic")
      .limit(3);

    res.status(200).json({
      message: "Matching users",
      users: matchingUsers,
    });
    
    
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "You have stumbled upon a server error",
    })
  }
}

const UsersController = {
  create: create,
  getCurrentUser: getCurrentUser,
  getProfile: getProfile,
  updateCurrentUser: updateCurrentUser,
  searchUser: searchUser,
};

module.exports = UsersController; 
