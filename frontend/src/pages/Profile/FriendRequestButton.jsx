import "./FriendRequestButton.css";

export function FriendRequestButton({ status, isSaving, onAddFriend }) {
    if (status === "loading") {
        return (
            <button className="friend-request-button friend-request-button--muted" disabled>
                Loading...
            </button>
        );
    }

    if (status === "friends") {
        return <p className="friend-request-status">✓ Friends</p>
    }

    if (status === "requested") {
        return (
            <button className="friend-request-button friend-request-button--muted" disabled>
                Friend requested
            </button>
        );
    }

    return (
        <button
            className="friend-request-button friend-request-button--primary"
            onClick={onAddFriend}
            disabled={isSaving}
        >
            {isSaving ? "Sending..." : "Add friend"}
        </button>
    );
}