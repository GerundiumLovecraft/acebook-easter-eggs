const FriendRequest = require("../models/friendRequest");
const { generateToken } = require("../lib/token");

async function getFriendRequestsById(req, res) {
    const friendRequestsRaw = await FriendRequest.find({ $or: [{from: req.user_id}, { to: req.user_id }]});
    



};

async function sendRequest(req, res) {};

async function sendReponse(req, res) {};


const FriendRequestsControler = {
    getFriendRequestsById: getFriendRequestsById,
    sendRequest: sendRequest,
    sendReponse: sendReponse,   
}