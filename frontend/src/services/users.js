const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUser(userId, token) {
    const requestOptions = {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    };
    
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, requestOptions);
    
    if (response.status !== 200) throw new Error("User not found");
    
    const data = await response.json();
    return data;
}

export async function getCurrentUser(token) {
    const response = await fetch(`${BACKEND_URL}/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) throw new Error("Could not fetch current user");

    return response.json();
}

export async function searchUser(token, name) {
    console.log("I am in searchUser service!");

    const response = await fetch(`${BACKEND_URL}/users/search?name=${name}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log(`Received the reponse: ${response}`);

    const data = await response.json();

    console.log(`The data is: ${data}`);

    if (!response.ok) {
        throw new Error("Server error")
    };

    return data.users;
};