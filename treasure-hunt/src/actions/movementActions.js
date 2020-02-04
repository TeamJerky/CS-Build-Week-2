import { axiosWithAuth } from "../util/axiosAuth";

export const START_MOVE = "START_MOVE";
export const MOVE_SUCCESS = "MOVE_SUCCESS";
export const MOVE_ERROR = "MOVE_ERROR";

export const move = (dispatch, direction) => {
  let command = { direction: direction };
  dispatch({ type: START_MOVE });
  return axiosWithAuth()
    .post("adv/move/", command)
    .then(res => {
      console.log(res.data);
      dispatch({ type: MOVE_SUCCESS, payload: res.data });
      return res.data;
    })
    .catch(err => {
      console.log("error", err.response);
      dispatch({ type: MOVE_ERROR, payload: err.response });
    });
};
