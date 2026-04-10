import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUser, getCurrentUser } from "../../src/services/users";
import { useNavigate, useParams } from "react-router-dom";

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
vi.mock("../../src/services/users", () => {
    return {
        getUser: vi.fn(),
        getCurrentUser: vi.fn(),
    };
    });

    // Mock react-router-dom
    vi.mock("react-router-dom", () => {
    const navigateMock = vi.fn();

    return {
        useNavigate: () => navigateMock,
        useParams: vi.fn(),
    };
    });

    describe("Profile Page", () => {
        beforeEach(() => {
            window.localStorage.clear();
            vi.clearAllMocks();
        });

        test("it displays profile data from the backend", async () => {
            window.localStorage.setItem("token", "testToken");

            useParams.mockReturnValue({ id: "12345" });

            getUser.mockResolvedValue({
            _id: "12345",
            email: "bob@test.com",
            profile: { firstName: "Bob", lastName: "Smith" },
            createdAt: "2026-04-09",
            updatedAt: "2026-04-09",
            });

            getCurrentUser.mockResolvedValue({
            _id: "99999",
            });

            render(<ProfilePage />);

            const heading = await screen.findByRole("heading");
            expect(heading.textContent).toEqual("Bob Smith");
            expect(screen.getByText("Email: bob@test.com").textContent).toEqual("Email: bob@test.com");
        });

        test("it navigates to login if no token is present", () => {
            useParams.mockReturnValue({ id: "12345" });

            render(<ProfilePage />);

            const navigateMock = useNavigate();
            expect(navigateMock).toHaveBeenCalledWith("/login");
        });

        test("it shows Edit Profile button when viewing own profile", async () => {
            window.localStorage.setItem("token", "testToken");

            useParams.mockReturnValue({ id: "12345" });

            getUser.mockResolvedValue({
                _id: "12345",
                email: "bob@test.com",
                profile: { firstName: "Bob", lastName: "Smith" },
                createdAt: "2026-04-09",
                updatedAt: "2026-04-09",
            });

            getCurrentUser.mockResolvedValue({
                _id: "12345",
        });

        render(<ProfilePage />);

        const button = await screen.findByRole("button", { name: /edit profile/i });
        expect(button.textContent).toEqual("Edit Profile");
        });

    test("it does not show Edit Profile button when viewing another user's profile", async () => {
        window.localStorage.setItem("token", "testToken");

        useParams.mockReturnValue({ id: "12345" });

        getUser.mockResolvedValue({
            _id: "12345",
            email: "alice@test.com",
            profile: { firstName: "Alice", lastName: "Jones" },
            createdAt: "2026-04-09",
            updatedAt: "2026-04-09",
        });

        getCurrentUser.mockResolvedValue({
            _id: "99999",
            });

            render(<ProfilePage />);

            await screen.findByRole("heading");
            expect(screen.queryByRole("button", { name: /edit profile/i })).toBeNull();
        });
});