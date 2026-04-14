const User = require("../models/user");
const { generateToken } = require("../lib/token");

async function getFriendList(req, res) {
    try {
        const UID = req.user_id;

        const userOfInteres = await User.findById(UID).populate('social.friendList');

        const friendList = userOfInteres.social.friendList;

        const newToken = generateToken(UID);

        res.status(200).json({
            message: "List of friends retrieved!",
            friendList: friendList,
            token: newToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "You have stumbled upon a server error" });
    }
};

const FriendsController = {
    getFriendList: getFriendList,
};

module.exports = FriendsController;