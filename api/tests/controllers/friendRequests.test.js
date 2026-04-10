const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const FriendRequest = require("../../models/friendRequest");
const User = require("../../models/user");

const { seededUsers, seededRequests } = require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
    return JWT.sign(
        {
            sub: userId,
            iat: Math.floor(Date.now() / 1000) - 5 * 60,
            exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
    );
};

let tokenOne, userOne;

describe("/friend_requests", () => {
    beforeEach(() => {
        const users = seededUsers();
        
        userOne = users[0];

        tokenOne = createToken(userOne.id);
    })

    describe("GET /", () => {
        test("returns 200 for authenticated user", async () => {
            const response = await request(app)
                .get("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`);

            expect(response.status).toEqual(200);
        })
        
        test("returns sorted incoming/outgoing requests for authenticated user", async () => {
            const friendRequests = seededRequests();

            const expectedFriendRequests = {
                incoming: [friendRequests[4]],
                outgoing: [friendRequests[0], friendRequests[1]],
            };

            const response = await request(app)
                .get("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`);

            const receivedFriendRequests = response.body.requests;

            expect(receivedFriendRequests.incoming[0]._id.toString()).toEqual(expectedFriendRequests.incoming[0].id);
            expect(receivedFriendRequests.outgoing[0]._id.toString()).toEqual(expectedFriendRequests.outgoing[0].id);
            expect(receivedFriendRequests.outgoing[1]._id.toString()).toEqual(expectedFriendRequests.outgoing[1].id);

        });

        test("returns a new token", async () => {
            // send a GET request
            const response = await request(app)
                .get("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`);

            // retrieve the token from the response
            const newToken = response.body.token;

            // decode old and new tokens
            const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
            const oldTokenDecoded = JWT.decode(tokenOne, process.env.JWT_SECRET);

            // iat stands for 'issued at'
            expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    });

    describe("POST /", () => {
        test("returns status 201 on success", async () => {
            const users = seededUsers();

            const response = await request(app)
                .post("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`)
                .send({ toUID: users[4].id });
            
            expect(response.status).toEqual(201);
        })

        test("returns 201 and sends a friend request", async () => {
            const users = seededUsers();
            const preUpdateFriendRequests = seededRequests();
            const numberOfRequestsPreUpdate = preUpdateFriendRequests.length;

            await request(app)
                .post("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`)
                .send({ toUID: users[4].id });

            const updatedFriendRequests = await FriendRequest.find().populate('from').populate('to');

            expect(updatedFriendRequests.length).toEqual(numberOfRequestsPreUpdate + 1);
            expect(updatedFriendRequests[numberOfRequestsPreUpdate].from.id).toEqual(userOne.id);
            expect(updatedFriendRequests[numberOfRequestsPreUpdate].to.id).toEqual(users[4].id);
            expect(updatedFriendRequests[numberOfRequestsPreUpdate].status).toEqual('pending');

        });
        test("returns a new token", async () => {
            const users = seededUsers();

            const response = await request(app)
                .post("/friend_requests")
                .set("Authorization", `Bearer ${tokenOne}`)
                .send({ toUID: users[4].id });

                const newToken = response.body.token;

                const oldTokenDecoded = JWT.decode(tokenOne, process.env.JWT_SECRET);
                const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);

                expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    });

    describe("PUT /:request_id", () => {
        let friendRequestOfInterest, userTwo, tokenTwo;

        beforeEach(() => {
            const users = seededUsers();
            const friendRequests = seededRequests();
            userTwo = users[1];
            friendRequestOfInterest = friendRequests[0];
            tokenTwo = createToken(userTwo.id);
        })

        test("returns 200 when the recipient approves the request", async () => {
            const response = await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenTwo}`)
                .send({
                    status: 'approved',
                });
            
                expect(response.status).toEqual(200);
        });

        test("changes the status of request when the recipient approves the request", async () => {
            await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenTwo}`)
                .send({
                    status: 'approved',
                });
            
            const updatedFriendRequest = await FriendRequest.findById(friendRequestOfInterest._id);

            expect(updatedFriendRequest.status).toEqual("approved");
        });

        test("adds both users to each other's friend list on approval", async () => {
            await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenTwo}`)
                .send({
                    status: 'approved',
                });
            
            const updatedUsers = await User.find({
                _id: { $in: [userOne._id, userTwo._id]}
            });

            expect(updatedUsers[0].social.friendList[0]).toEqual(userTwo._id);
            expect(updatedUsers[1].social.friendList[0]).toEqual(userOne._id);
        });

        test("returns 200 when the recipient rejects the request", async () => {
            const response = await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenTwo}`)
                .send({
                    status: 'rejected',
                });
            expect(response.status).toEqual(200);
        });

        test("updates the status of request to rejected when the recipient rejects the request", async () => {
            await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenTwo}`)
                .send({
                    status: 'rejected',
                });
            
            const updatedFriendRequest = await FriendRequest.findById(friendRequestOfInterest._id);

            expect(updatedFriendRequest.status).toEqual("rejected");
        })
        test("returns 401 when a non-recipient tries to respond", async () => {
            const response = await request(app)
                .put(`/friend_requests/${friendRequestOfInterest.id}`)
                .set("Authorization", `Bearer ${tokenOne}`)
                .send({
                    status: 'rejected',
                });
            
            expect(response.status).toEqual(401);
        });
    });
});