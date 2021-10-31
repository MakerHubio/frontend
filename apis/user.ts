const base = 'http://localhost:5002';

async function LoginUser(username: string, password: string) {
    const f = await fetch(`${base}/authentication/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            username,
            password,
        }),
    });
    return f.status;
}

async function LogoutUser() {
    const f = await fetch(`${base}/authentication/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return f.status;
}

export {
    LoginUser,
    LogoutUser,
};
