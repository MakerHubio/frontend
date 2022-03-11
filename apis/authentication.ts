import axios, { AxiosResponse } from 'axios';
import { RegisterRequest } from '../models/authentication';

const base = 'http://data.makerhub.io/authentication';

async function RegisterUser(register: RegisterRequest): Promise<AxiosResponse<string>> {
    return axios(`${base}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: register,
    });
}

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
    RegisterUser,
    LoginUser,
    LogoutUser,
};
