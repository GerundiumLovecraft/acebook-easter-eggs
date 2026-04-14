require("../mongodb_helper");
const FriendRequest = require("../../models/friendRequest");
const {default: mongoose} = require("mongoose");

describe("FriendRequest model", () => {
    let friendRequest, fromUID, toUID;

    beforeEach(async () => {
        await FriendRequest.deleteMany({});

        fromUID = new mongoose.Types.ObjectId();
        toUID = new mongoose.Types.ObjectId();

        friendRequest = new FriendRequest({
            from: fromUID,
            to: toUID,
        });
    });

    it("has a UID of request sender", () => {
        expect(friendRequest.from).toEqual(fromUID);
    });

    it("has a UID of request receiver", () => {
        expect(friendRequest.to).toEqual(toUID);
    });

    it("has 'pending' status by default", () => {
        expect(friendRequest.status).toEqual('pending');
    });

    it("can list all friend requests", async () => {
        const friendRequests = await FriendRequest.find();
        expect(friendRequests).toEqual([]);
    });

    it("can save a friend request", async () => {
        await friendRequest.save();
        const friendRequests = await FriendRequest.find();

        expect(friendRequests[0].from).toEqual(fromUID);
        expect(friendRequests[0].to).toEqual(toUID);
        expect(friendRequests[0].status).toEqual("pending")
    });
})

/*
const FriendRequestSchema = new mongoose.Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
});
*/
