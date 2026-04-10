const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const { generateToken } = require("../lib/token");
const { default: mongoose } = require("mongoose");

async function getFriendRequestsById(req, res) {
    try{
        // Get the user's ID
        const UID = req.user_id;
        // Send a query to the MongoDB to get all matching requests
        const friendRequestsRaw = await FriendRequest.find({ 
            $or: [{from: UID}, { to: UID }],
            status: 'pending'
        })
            .populate('from')
            .populate('to');

        // Sort the requests to incoming and outgoing
        const friendRequestSorted = friendRequestsRaw.reduce((requests, request) => {
            if (request.to.id === UID) {
                requests.incoming.push(request);
            } else if (request.from.id === UID) {
                requests.outgoing.push(request);
            };

            return requests
        }, {
            incoming: [],
            outgoing: [],
        });

        // Generate an updated token
        const newToken = generateToken(UID);

        // Send the response to the front-end
        res.status(200).json({
            message: "Look at all the requests",
            token: newToken,
            requests: friendRequestSorted,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "You've stumbled upon a server issue"});
    }
};

async function sendRequest(req, res) {
    try {
        // Get the user IDs 
        const fromUID = req.user_id;
        const toUID = req.body.toUID;

        // Create new friend request object
        const request = new FriendRequest({
            from: fromUID,
            to: toUID,
        });
        // Save the new request in the DB
        request.save();

        // Create new token
        const newToken = generateToken(fromUID);

        // Send the response to the front-end
        res.status(201).json({ message: "Request sent!", token: newToken})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "You've stumbled upon a server issue"});
    }
};

async function sendResponse(req, res) {
    try {
        const requestID = req.params.request_id;
        const updatedStatus = req.body.status;

        const friendRequest = await FriendRequest.findOne({
            _id: new mongoose.Types.ObjectId(requestID),
        })
            .populate('from')
            .populate('to');

        if (req.user_id !== friendRequest.to.id) {
            return res.status(401).json({ message: "unauthorised user"});
        }

        friendRequest.status = updatedStatus;

        if (updatedStatus === 'approved') {
            const fromUser = friendRequest.from;
            const toUser = friendRequest.to;

            fromUser.social.friendList.push(toUser.id);
            toUser.social.friendList.push(fromUser.id);

            await Promise.all([
                fromUser.save(),
                toUser.save(),
                friendRequest.save()
            ]);

            res.status(200).json({ message: "Request accepted" })
        } else if (updatedStatus === 'rejected') {
            await friendRequest.save();
            res.status(200).json({ message: "Request rejected" });
        }        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "You've stumbled upon a server issue"});
    }
};


const FriendRequestsControler = {
    getFriendRequestsById: getFriendRequestsById,
    sendRequest: sendRequest,
    sendResponse: sendResponse,   
}

module.exports = FriendRequestsControler;