import { ActionType, GlobalStateInterface } from './types';
import { initialState } from './cons';

const Reducer = (state: GlobalStateInterface, action: ActionType): any => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                loggedUser: action.payload,
            };
        case 'PURGE_STATE':
            return initialState;
        default:
            return state;
    }
};

export default Reducer;
