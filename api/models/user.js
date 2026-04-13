const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    profile: {
    // TODO: set required True to first and last Name once Signup form is complete 
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}, 
    profilePic: {type: String, default: ''}
  },
  social: {
    friendList: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []},
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
