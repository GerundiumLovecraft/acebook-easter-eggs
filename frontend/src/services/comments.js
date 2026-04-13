const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getComments = async (postId, token) => {
  const response = await fetch(
    `${BACKEND_URL}/posts/${postId}/comments`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  return response.json();
};

export const addComment = async (postId, content, token) => {
  const response = await fetch(
    `${BACKEND_URL}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    }
  );

  return response.json();
};