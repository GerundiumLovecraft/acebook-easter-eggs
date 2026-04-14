const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFriendRequests(token) {
    const response = await fetch(`${BACKEND_URL}/friend_requests`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch friend requests");
    }
    return response.json();
}

export async function sendFriendRequestResponse(token, requestId, status) {
    const response = await fetch(`${BACKEND_URL}/friend_requests/${requestId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error("Failed to send response");
    }
    return response.json();
}

export async function friendRequestExists(token, UID) {
    const response = await fetch(`${BACKEND_URL}/friend_requests/request_exists?toUID=${UID}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(!response.ok) {
        throw new Error("Failed to check friend request");
    };

    return response.json();
};

export async function sendFriendRequest(token, UID) {
    const response = await fetch(`${BACKEND_URL}/friend_requests`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ toUID: UID })
    })

    const body = await response.json();

    if(response.status === 400) {
        throw new alert(body.message);
    } else if (!response.ok) {
        throw new alert("Failed to send friend request");
    };

    return body
}