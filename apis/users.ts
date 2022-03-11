import Identicon from 'identicon.js';
import axios, { AxiosResponse } from 'axios';
import getCookie from '../utils/cookie';
import { UserProfile } from '../models/User';

const base = 'http://data.makerhub.io/users';

const GenerateAvatarUrl = (userId: string, size = 256) => `data:image/png;base64,${new Identicon(userId, size).toString()}`;

async function GetUserProfile(id: string, token?: string): Promise<AxiosResponse<UserProfile>> {
  return axios(`${base}/profile/${id}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: typeof (document) !== 'undefined' ? getCookie('mh_authorization') : token ?? '',
    },
  });
}

async function UpdateUserProfile(userProfile: UserProfile): Promise<AxiosResponse<UserProfile>> {
  return axios(`${base}/profile`, {
    method: 'PUT',
    withCredentials: true,
    data: userProfile,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

export {
  GenerateAvatarUrl,
  GetUserProfile,
  UpdateUserProfile,
};
