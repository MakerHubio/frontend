import { Dispatch } from 'react';
import JWTUser from '../models/JWTUser';

export interface GlobalStateInterface {
    loggedUser: JWTUser | null;
}

export type ActionType = {
    type: string;
    payload?: any;
};

export type ContextType = {
    globalState: GlobalStateInterface;
    dispatch: Dispatch<ActionType>;
};
