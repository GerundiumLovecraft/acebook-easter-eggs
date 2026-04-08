const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    profile: {
    // TODO: set required True to first and last Name once Signup form is complete 
    firstName: {type: String, required: false},
    lastName: {type: String, required: false}, 
    displayName: String,
    profilePic: {type: String, default: ''}
  },
  
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
