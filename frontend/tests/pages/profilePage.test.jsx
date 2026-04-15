import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUser, getCurrentUser, updateCurrentUser } from "../../src/services/users";
import { getPostsByUserId } from "../../src/services/posts";
import { friendRequestExists, sendFriendRequest } from "../../src/services/friendRequests";
import { getFriendList } from "../../src/services/friends";
import { formatCreatedAt, formatLastUpdated } from "../../src/utils/dates";
import { useParams } from "react-router-dom";

const mockNavigate = vi.fn();

// Mock localStorage
let store = {};

Object.defineProperty(window, "localStorage", {
    value: {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => {
        store[key] = String(value);
        }),
        removeItem: vi.fn((key) => {
        delete store[key];
        }),
        clear: vi.fn(() => {
        store = {};
        }),
    },
    writable: true,
    });

    // Mock services
    vi.mock("../../src/services/users", () => ({
    getUser: vi.fn(),
    getCurrentUser: vi.fn(),
    updateCurrentUser: vi.fn(),
    }));

    vi.mock("../../src/services/posts", () => ({
    getPostsByUserId: vi.fn(),
    }));

    vi.mock("../../src/services/friendRequests", () => ({
    friendRequestExists: vi.fn(),
    sendFriendRequest: vi.fn(),
    }));

    vi.mock("../../src/services/friends", () => ({
    getFriendList: vi.fn(),
    }));

    vi.mock("../../src/utils/dates", () => ({
    formatCreatedAt: vi.fn(),
    formatLastUpdated: vi.fn(),
    }));

    // Mock child components
    vi.mock("../../src/components/Post", () => ({
    default: ({ post }) => <div data-testid="post">{post.message}</div>,
    }));

    vi.mock("../../src/pages/Profile/FriendRequestButton", () => ({
    FriendRequestButton: ({ status, isSaving, onAddFriend }) => {
        let label = "Add Friend";

        if (isSaving) label = "Sending...";
        else if (status === "requested") label = "Requested";
        else if (status === "friends") label = "Friends";

        return <button onClick={onAddFriend}>{label}</button>;
    },
    }));

    // Mock react-router-dom
    vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: vi.fn(),
        Link: ({ to, children }) => <a href={to}>{children}</a>,
    };
    });

    function makeProfile(overrides = {}) {
    return {
        _id: "12345",
        email: "bob@test.com",
        profile: {
        firstName: "Bob",
        lastName: "Smith",
        profilePic: "https://example.com/bob.jpg",
        },
        createdAt: "2026-04-09T00:00:00.000Z",
        updatedAt: "2026-04-10T00:00:00.000Z",
        ...overrides,
    };
    }

    describe("ProfilePage", () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();

        useParams.mockReturnValue({ id: "12345" });

        formatCreatedAt.mockReturnValue("9 April 2026");
        formatLastUpdated.mockReturnValue("1 day ago");

        getPostsByUserId.mockResolvedValue({ posts: [] });
        getFriendList.mockResolvedValue({ friendList: [] });
        friendRequestExists.mockResolvedValue({ requestExists: false });
        sendFriendRequest.mockResolvedValue({});
    });

    test("it displays profile data, formatted dates, and posts from the backend", async () => {
        window.localStorage.setItem("token", "testToken");

        getUser.mockResolvedValue(makeProfile());
        getCurrentUser.mockResolvedValue({ _id: "99999" });
        getPostsByUserId.mockResolvedValue({
        posts: [
            { _id: "post-1", message: "First post" },
            { _id: "post-2", message: "Second post" },
        ],
        });

        render(<ProfilePage />);

        const heading = await screen.findByRole("heading", { name: "Bob Smith" });
        expect(heading).toBeTruthy();
        expect(screen.getByText("Email: bob@test.com")).toBeTruthy();
        expect(screen.getByText("Joined: 9 April 2026")).toBeTruthy();
        expect(screen.getByText("Active: 1 day ago")).toBeTruthy();
        expect(screen.getByRole("heading", { name: /posts/i })).toBeTruthy();
        expect(screen.getByText("First post")).toBeTruthy();
        expect(screen.getByText("Second post")).toBeTruthy();

        expect(getUser).toHaveBeenCalledWith("12345", "testToken");
        expect(getCurrentUser).toHaveBeenCalledWith("testToken");
        expect(getPostsByUserId).toHaveBeenCalledWith("12345", "testToken");
    });

    test("it navigates to login if no token is present", async () => {
        render(<ProfilePage />);

        await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    test("it shows Edit Profile button when viewing own profile", async () => {
        window.localStorage.setItem("token", "testToken");

        getUser.mockResolvedValue(makeProfile());
        getCurrentUser.mockResolvedValue({ _id: "12345" });

        render(<ProfilePage />);

        const editButton = await screen.findByRole("button", { name: /edit profile/i });
        expect(editButton).toBeTruthy();

        expect(getFriendList).not.toHaveBeenCalled();
        expect(friendRequestExists).not.toHaveBeenCalled();
    });

    test("it shows FriendRequestButton when viewing another user's profile", async () => {
        window.localStorage.setItem("token", "testToken");

        getUser.mockResolvedValue(
        makeProfile({
            _id: "12345",
            email: "alice@test.com",
            profile: {
            firstName: "Alice",
            lastName: "Jones",
            profilePic: "https://example.com/alice.jpg",
            },
        })
        );

        getCurrentUser.mockResolvedValue({ _id: "99999" });
        getFriendList.mockResolvedValue({ friendList: [] });
        friendRequestExists.mockResolvedValue({ requestExists: false });

        render(<ProfilePage />);

        const heading = await screen.findByRole("heading", { name: "Alice Jones" });
        expect(heading).toBeTruthy();
        expect(screen.queryByRole("button", { name: /edit profile/i })).toBeNull();
        expect(screen.getByRole("button", { name: /add friend/i })).toBeTruthy();

        expect(getFriendList).toHaveBeenCalledWith("testToken");
        expect(friendRequestExists).toHaveBeenCalledWith("testToken", "12345");
    });

    test("it enters edit mode and saves updated profile data", async () => {
        window.localStorage.setItem("token", "testToken");

        getUser.mockResolvedValue(makeProfile());
        getCurrentUser.mockResolvedValue({ _id: "12345" });

        updateCurrentUser.mockResolvedValue({
        user: makeProfile({
            email: "robert@test.com",
            profile: {
            firstName: "Robert",
            lastName: "Smith",
            profilePic: "https://example.com/bob.jpg",
            },
        }),
        });

        render(<ProfilePage />);

        fireEvent.click(await screen.findByRole("button", { name: /edit profile/i }));

        const firstNameInput = screen.getByDisplayValue("Bob");
        const lastNameInput = screen.getByDisplayValue("Smith");
        const emailInput = screen.getByDisplayValue("bob@test.com");

        fireEvent.change(firstNameInput, {
        target: { name: "firstName", value: "Robert" },
        });

        fireEvent.change(lastNameInput, {
        target: { name: "lastName", value: "Smith" },
        });

        fireEvent.change(emailInput, {
        target: { name: "email", value: "robert@test.com" },
        });

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
        expect(updateCurrentUser).toHaveBeenCalledWith(
            {
            email: "robert@test.com",
            firstName: "Robert",
            lastName: "Smith",
            },
            "testToken"
        );
        });

        const updatedHeading = await screen.findByRole("heading", { name: "Robert Smith" });
        expect(updatedHeading).toBeTruthy();
        expect(screen.getByText("Email: robert@test.com")).toBeTruthy();
    });

    test("it shows save and cancel buttons in edit mode", async () => {
        window.localStorage.setItem("token", "testToken");

        getUser.mockResolvedValue(makeProfile());
        getCurrentUser.mockResolvedValue({ _id: "12345" });

        render(<ProfilePage />);

        fireEvent.click(await screen.findByRole("button", { name: /edit profile/i }));

        expect(screen.getByRole("button", { name: /save/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeTruthy();
    });
});