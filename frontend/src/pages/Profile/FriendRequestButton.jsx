export function FriendRequestButton({ status, isSaving, onAddFriend }) {
    if (status === "loading") {
        return <button disabled>Loading...</button>;
    }

    if (status === "friends") {
        return <p>Friends!</p>;
    }

    if (status === "requested") {
        return <button disabled>Friend requested</button>;
    }

    return (
        <button onClick={onAddFriend} disabled={isSaving}>
        {isSaving ? "Sending..." : "Add friend"}
        </button>
    );
}