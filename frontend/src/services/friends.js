const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFriendList(token) {
    const response = await fetch(`${BACKEND_URL}/friends`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch friend list");
    }
    return response.json();
}