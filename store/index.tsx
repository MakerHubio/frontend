import React, { createContext, ReactElement, ReactNode, useEffect, useReducer, useRef } from 'react';
import { initialState } from './cons';
import Reducer from './reducer';
import { ContextType } from './types';

/**
 * React Context-based Global Store with a reducer
 * and persistent saves to sessionStorage/localStorage
 **/
export const globalContext = createContext({} as ContextType);

function initializeState() {
    /*
     the order in which the the data is compared is very important;
     first try to populate the state from Storage if not return initialState
    */

    return initialState;
}

export function GlobalStore({ children }: { children: ReactNode }): ReactElement {
    const [globalState, dispatch] = useReducer(Reducer, initializeState());
    const initialRenderGlobalState = useRef(true);

    useEffect(() => {
        /*
         populate either sessionStorage or localStorage
         data from globalState based on persistenceType
        */
        if (initialRenderGlobalState.current) {
            initialRenderGlobalState.current = false;
        }
    }, [globalState]);

    return (<globalContext.Provider value={{ globalState, dispatch }}>
        {children}
            </globalContext.Provider>);
}
