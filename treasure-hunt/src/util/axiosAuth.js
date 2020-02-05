import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REACT_APP_KEY}`
      // Authorization: `Token ${process.env.REACT_APP_TEST_KEY}`
    },
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/"
    // baseURL: "http://127.0.0.1:8000/api/"
  });
};
