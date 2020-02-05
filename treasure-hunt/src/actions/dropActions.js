import { axiosWithAuth } from "../util/axiosAuth";

export const DROP_START = "DROP_START";
export const DROP_SUCESS = "DROP_SUCCESS";
export const DROP_ERROR = "DROP_ERROR"


export const Drop = dispatch => {
    dispatch({type: DROP_START});
    axiosWithAuth()
    .get("/drop")
    .then(res => {
        dispatch({type: DROP_SUCESS, payload: res.data});
    })
    .catch(err => {
        dispatch({type: DROP_ERROR, payload: err.response.data})
    })
}