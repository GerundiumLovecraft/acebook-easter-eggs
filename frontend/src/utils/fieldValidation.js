export  function isValidEmail(value) {
    const email = value.trim();
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export  function isValidImageUrl(value) {
    if (!value.trim()) return true;

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}