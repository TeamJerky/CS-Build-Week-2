import {DROP_START , DROP_SUCCESS, DROP_ERROR } from "../actions"

import { initialState } from "./initialState"

export const takeReducer = (initialState, { type, payload }) => {
  switch (type) {
    case DROP_START:
      return {
        ...initialState,
        isLoading: true
      };
    case DROP_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        //UPDATE TO DROP ITEM
        inventory: [...inventory, payload]
      };
    case DROP_ERROR:
      return {
        ...initialState,
        error: payload
      };
    default:
      return initialState;
  }
};