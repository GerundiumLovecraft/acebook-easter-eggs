const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
});

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

module.exports = FriendRequest;