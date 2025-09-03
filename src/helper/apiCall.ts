import axios from "axios";

export const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BE,
  withCredentials: true,
});
