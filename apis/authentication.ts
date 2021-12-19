const base = 'http://data.makerhub.io:8080/authentication';

async function LoginUser(username: string, password: string) {
    const f = await fetch(`${base}/login`, {
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
    const f = await fetch(`${base}/logout`, {
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
