import createFetchMock from "vitest-fetch-mock";
import { describe, vi, beforeEach, test, expect } from "vitest";

import { getUser, getCurrentUser } from "../../src/services/users";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("users service", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    describe("getUser", () => {
        test("calls the backend url for a specific user", async () => {
        const testUserId = "12345";
        const testToken = "testToken";

        fetch.mockResponseOnce(
            JSON.stringify({
            _id: "12345",
            email: "bob@test.com",
            profile: { firstName: "Bob", lastName: "Smith" },
            }),
            { status: 200 }
        );

        await getUser(testUserId, testToken);

        const fetchArguments = fetch.mock.lastCall;
        const url = fetchArguments[0];
        const options = fetchArguments[1];

        expect(url).toEqual(`${BACKEND_URL}/users/${testUserId}`);
        expect(options.method).toEqual("GET");
        expect(options.headers.Authorization).toEqual(`Bearer ${testToken}`);
        });

        test("returns the user data if the request was successful", async () => {
            const testUserId = "12345";
            const testToken = "testToken";

            const mockUser = {
                _id: "12345",
                email: "bob@test.com",
                profile: { firstName: "Bob", lastName: "Smith" },
            };

            fetch.mockResponseOnce(JSON.stringify(mockUser), { status: 200 });

            const user = await getUser(testUserId, testToken);
            expect(user).toEqual(mockUser);
        });

        test("throws an error if the request failed", async () => {
            const testUserId = "12345";
            const testToken = "testToken";

            fetch.mockResponseOnce(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });

            await expect(getUser(testUserId, testToken)).rejects.toThrow("User not found");
        });
    });

    describe("getCurrentUser", () => {
        test("calls the backend url for the current user", async () => {
        const testToken = "testToken";

        fetch.mockResponseOnce(
            JSON.stringify({
            _id: "99999",
            email: "current@test.com",
            }),
            { status: 200 }
        );

        await getCurrentUser(testToken);

        const fetchArguments = fetch.mock.lastCall;
        const url = fetchArguments[0];
        const options = fetchArguments[1];

        expect(url).toEqual(`${BACKEND_URL}/users/me`);
        expect(options.method).toEqual("GET");
        expect(options.headers.Authorization).toEqual(`Bearer ${testToken}`);
        });

        test("returns the current user data if the request was successful", async () => {
            const testToken = "testToken";

            const mockCurrentUser = {
                _id: "99999",
                email: "current@test.com",
            };

            fetch.mockResponseOnce(JSON.stringify(mockCurrentUser), { status: 200 });

            const user = await getCurrentUser(testToken);
            expect(user).toEqual(mockCurrentUser);
        });

        test("throws an error if the request failed", async () => {
            const testToken = "testToken";

            fetch.mockResponseOnce(
                JSON.stringify({ message: "Could not fetch current user" }),
                { status: 500 }
            );

            await expect(getCurrentUser(testToken)).rejects.toThrow(
                "Could not fetch current user"
            );
        });
    });
});