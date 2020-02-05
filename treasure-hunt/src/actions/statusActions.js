// import {axiosWithAuth} from "../util/axiosAuth"

// export const STATUS_START = "STATUS_START"
// export const STATUS_SUCCESS = "STATUS_SUCCESS"
// export const STATUS_ERROR = "STATUS_ERROR"

// export const status = (dispatch) => {
//     dispatch({type: STATUS_START})
//     axiosWithAuth()
//     .post("/status/")
//     .then(res => {
//         dispatch({type: STATUS_SUCCESS, payload: res.data})
//     })
//     .catch(err => {
//         dispatch({typeL STATUS_ERROR, payload: err.response.data})
//     })
// }