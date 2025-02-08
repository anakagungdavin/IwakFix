import axios from "axios";
// const accessToken = sessionStorage.getItem("authToken");

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API,
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//   },
});