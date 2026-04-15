import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { FriendRequestButton } from "../../src/pages/Profile/FriendRequestButton";

describe("FriendRequestButton", () => {
    test("it shows a disabled loading button when status is loading", () => {
        render(
        <FriendRequestButton
            status="loading"
            isSaving={false}
            onAddFriend={vi.fn()}
        />
        );

        const button = screen.getByRole("button", { name: /loading/i });

        expect(button).toBeTruthy();
        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe("Loading...");
        expect(button.className).toContain("friend-request-button--muted");
    });

    test("it shows Friends text when status is friends", () => {
        render(
        <FriendRequestButton
            status="friends"
            isSaving={false}
            onAddFriend={vi.fn()}
        />
        );

        const text = screen.getByText("✓ Friends");

        expect(text).toBeTruthy();
        expect(text.tagName).toBe("P");
        expect(text.className).toContain("friend-request-status");
        expect(screen.queryByRole("button")).toBeNull();
    });

    test("it shows a disabled requested button when status is requested", () => {
        render(
        <FriendRequestButton
            status="requested"
            isSaving={false}
            onAddFriend={vi.fn()}
        />
        );

        const button = screen.getByRole("button", { name: /friend requested/i });

        expect(button).toBeTruthy();
        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe("Friend requested");
        expect(button.className).toContain("friend-request-button--muted");
    });

    test("it shows an enabled Add friend button by default", () => {
        render(
        <FriendRequestButton
            status="none"
            isSaving={false}
            onAddFriend={vi.fn()}
        />
        );

        const button = screen.getByRole("button", { name: /add friend/i });

        expect(button).toBeTruthy();
        expect(button.disabled).toBe(false);
        expect(button.textContent).toBe("Add friend");
        expect(button.className).toContain("friend-request-button--primary");
    });

    test("it calls onAddFriend when Add friend is clicked", () => {
        const onAddFriend = vi.fn();

        render(
        <FriendRequestButton
            status="none"
            isSaving={false}
            onAddFriend={onAddFriend}
        />
        );

        const button = screen.getByRole("button", { name: /add friend/i });
        fireEvent.click(button);

        expect(onAddFriend).toHaveBeenCalledTimes(1);
    });

    test("it shows Sending... and disables the button when isSaving is true", () => {
        const onAddFriend = vi.fn();

        render(
        <FriendRequestButton
            status="none"
            isSaving={true}
            onAddFriend={onAddFriend}
        />
        );

        const button = screen.getByRole("button", { name: /sending/i });

        expect(button).toBeTruthy();
        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe("Sending...");
        expect(button.className).toContain("friend-request-button--primary");

        fireEvent.click(button);
        expect(onAddFriend).not.toHaveBeenCalled();
    });
});