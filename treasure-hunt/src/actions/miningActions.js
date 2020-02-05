import { axiosWithAuth } from "../util/axiosAuth"

export const MINING_START = "MINING_MAP"
export const MINING_SUCESS = "MINING_SUCESS"
export const MINING_ERROR = "MINING_ERROR"

export const mine = dispatch => {
  dispatch({ type: MINING_START });
  axiosAuth()
    .get("bc/mine/")
    .then(res => {
      dispatch({ type: MINING_SUCESS, payload: res.data });
    })
    .catch(err => {
      console.log("Error occured!: ", err.response);
      dispatch({ type: MINING_ERROR, payload: err.response.data });
    });
};