import { START_MOVE, MOVE_SUCCESS, MOVE_ERROR } from "../actions";

export const gameReducer = (state, { type, payload }) => {
  switch (type) {
    case START_MOVE:
      return {
        ...state,
        isLoading: true
      };
    case MOVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ...payload
      };
    case MOVE_ERROR:
      return {
        ...state,
        error: payload,
        isLoading: false
      };
    default:
      return state;
  }
};
