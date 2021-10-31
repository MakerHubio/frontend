import { Dispatch } from 'react';

export interface GlobalStateInterface {
    loggedUser: any | null;
}

export type ActionType = {
    type: string;
    payload?: any;
};

export type ContextType = {
    globalState: GlobalStateInterface;
    dispatch: Dispatch<ActionType>;
};
