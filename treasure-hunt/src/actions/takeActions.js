import {axiosAuth} from "../util/axiosAuth";

export const TAKING_ITEM = "TAKING_ITEM";
export const TAKING_ITEM_SUCCESS = "TAKING_ITEM_SUCCESS";
export const TAKING_ITEM_ERROR = "TAKING_ITEM_ERROR";

export const take = dispatch => {
    dispatch({type: TAKING_ITEM});
    axiosAuth()
    .get("/take")
    .then(res => {
        dispatch({type: TAKING_ITEM_SUCCESS, payload: res.data});
    })
    .catch(err => {
        console.log("error occurred: ", err.response);
        dispatch({ type: TAKING_ITEM_ERROR, payload: err.response.data});
    });
};
