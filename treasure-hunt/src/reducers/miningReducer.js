import { MINING_START, MINING_SUCCESS, MINING_ERROR } from '../actions/miningActions'

import { initialState } from "./initialState"


export const mineReducer = (initialState, { type, payload }) => {
  switch (type) {
    case MINING_START:
      return {
        ...initialState,
        isLoading: true
      };
    case MINING_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        coins: payload
      };
    case MINING_ERROR:
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
};