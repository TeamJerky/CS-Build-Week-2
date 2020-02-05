import {SELL_START, SELL_SUCCESS, SELL_ERROR} from "../actions"

import {initialState} from "./initialState"

export const sellReducer = (initialState, {type, payload}) => {
    switch(type){
        case SELL_START:
            return {
                ...initialState,
                isLoading:true
            };
        case SELL_SUCCESS:
            return {
                ...initialState,
                isLoading: false,
                gold: initialState.gold + payload
            };
        case SELL_ERROR:
            return {
                ...initialStatem,
                error: payload
            };
        default:
            return initialState;
    }
}