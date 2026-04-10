const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const FriendRequest = require("../../models");
const User = require("../../models");

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

let tokenOne;
let tokenTwo;
let userOne;
let userTwo;
describe("/friend_requests", () => {
    beforeEach(() => {
        const users = seededUsers;
        
        userOne = users[0];
        userTwo = users
    })

    describe("GET /", () => {
        test("returns 200 and sorted incoming/outgoing requests for authenticated user", async () => {});
        test("returns a new token", async () => {
            const users = 
        });
    });

    describe("POST /", () => {
        test("returns 201 and sends a friend request", async () => {});
        test("returns a new token", async () => {});
    });

    describe("PUT /:request_id", () => {
        test("returns 200 when the recipient approves the request", async () => {});
        test("adds both users to each other's friend list on approval", async () => {});
        test("returns 200 when the recipient rejects the request", async () => {});
        test("returns 401 when a non-recipient tries to respond", async () => {});
    });
});