export const backendHost = 'http://localhost:3000';

export const base64ImageEntry = 'data:image/png;base64,'

export const UserRole = {
    PURCHASER: 0,
    SELLER: 1,
    MODERATOR: 2,
}

export const getRoleName = role => {
    if (role === UserRole.PURCHASER) return "Purchaser"
    if (role === UserRole.SELLER) return "Seller"
    if (role === UserRole.MODERATOR) return "Moderator"
}

export const fetchUserData = async () => {
    let data = null;
    try {
        const res = await fetch(`${backendHost}/api/user`, {
            method: 'GET',
            credentials: 'include'
        });
        if (res.status === 401) {
            return null;
        }
        if (!res.ok) {
            throw new Error(await res.text());
        }
        data = await res.json();
    } catch (err) {
        console.error(err);
    }

    return data;
};