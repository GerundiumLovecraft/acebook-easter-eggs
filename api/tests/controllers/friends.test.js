const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");

const { seededUsers, seededRequests } = require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
    return JWT.sign({
            sub: userId,
            iat: Math.floor(Date.now() / 1000) - 5 * 60,
            exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
    );
};

let tokenOne, userOne;

describe("/friends", () => {
    beforeEach( async () => {
        const users = seededUsers();

        userOne = users[0];
        tokenOne = createToken(userOne.id);

        //Let another user to accept the friend request
        const userTwo = users[1];
        const tokenTwo = createToken(userTwo.id);
        const seededFriendRequests = seededRequests();

        await request(app)
            .put(`/friend_requests/${seededFriendRequests[0].id}`)
            .set("Authorization", `Bearer ${tokenTwo}`)
            .send({
                status: "approved"
            });
    });

    describe("GET /friends", () => {
        test("returns 200 for authenticated users", async () => {
            const response = await request(app)
                .get("/friends")
                .set("Authorization", `Bearer ${tokenOne}`);
            
            expect(response.status).toEqual(200);
        });

        test("returns an array of friends for authenticated users", async () => {
            const response = await request(app)
                .get("/friends")
                .set("Authorization", `Bearer ${tokenOne}`);

            const users = seededUsers();
            const friendListFromRes = response.body.friendList;

            expect(friendListFromRes[0]._id.toString()).toEqual(users[1].id);
        });

        test("returns a new token", async () => {
            const response = await request(app)
                .get("/friends")
                .set("Authorization", `Bearer ${tokenOne}`);
            
            // retrieve the new token from the response
            const newToken = response.body.token;

            // decode old and new tokens
            const oldTokenDecoded = JWT.decode(tokenOne, process.env.JWT_SECRET);
            const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);

            expect(oldTokenDecoded.iat < newTokenDecoded.iat).toEqual(true);
        });
    });
})