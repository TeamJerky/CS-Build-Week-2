import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      //   Authorization: `Token ${process.env.REACT_APP_KEY}`
      Authorization: `Token 595adb2f2c9dc4e5f3bf6d46ef9562660fe73832`
    },
    // baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/adv/"
    baseURL: "http://127.0.0.1:8000/api/adv/"
  });
};
