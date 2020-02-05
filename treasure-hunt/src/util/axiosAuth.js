import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token cb3f58605a87a2ed5d46d58dab306ffd954db35d`
      // Authorization: `Token ${process.env.REACT_APP_TEST_KEY}`
    },
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/"
    // baseURL: "http://127.0.0.1:8000/api/"
  });
};
