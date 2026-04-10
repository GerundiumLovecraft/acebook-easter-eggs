export function formatCreatedAt(createdAt) {
    if (!createdAt) return "";

    return new Date(createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });
}

export function formatLastUpdated(updatedAt) {
    if (!updatedAt) return "";

    const updatedDate = new Date(updatedAt);
    const now = new Date();

    const diffInMs = now - updatedDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays >= 1) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    if (diffInHours >= 1) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    if (diffInMinutes >= 1) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    return "less than a minute ago";
}