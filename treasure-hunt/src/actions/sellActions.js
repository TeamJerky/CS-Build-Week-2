import {axiosWithAuth} from "../util/axiosAuth"


export const SELL_START = "SELL_START";
export const SELL_SUCCESS = "SELL_SUCCESS";
export const SELL_ERROR = "SELL_ERROR";

// ** IMPORTANT ** - TO ACTUALLY SELL
// treasure = { "name": "treasure", "confirm": "yes" }

export const sell = ( dispatch, treasure )=> {
    dispatch({type: SELL_START})
    axiosWithAuth()
    .post("/sell", treasure)
    .then(res => {
        dispatch({type: SELL_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({type: SELL_ERROR, payload: err.response.data})
    })
}