import { axiosWithAuth } from "../src/util/axiosAuth";

export const initGame = () => {
  return axiosWithAuth()
    .get("init/")
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};
