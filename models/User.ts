import Model from './Model';

export interface User extends Model {
    username: string
    avatarId: string,
}

export interface UserProfile extends Model {
    username: string,
    avatarId: string,
    bannerId: string,
    bio: string,
    website: string,
    locationCode: string,
}
