import {TAKING_ITEM , TAKING_ITEM_SUCCESS, TAKING_ITEM_ERROR } from "../actions"

import { initialState } from "./initialState"

export const takeReducer = (initialState, { type, payload }) => {
  switch (type) {
    case TAKING_ITEM:
      return {
        ...initialState,
        isLoading: true
      };
    case TAKING_ITEM_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        inventory: [...inventory, payload]
      };
    case TAKING_ITEM_ERROR:
      return {
        ...initialState,
        error: payload
      };
    default:
      return initialState;
  }
};