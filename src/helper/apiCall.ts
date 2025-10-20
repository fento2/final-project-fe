import axios from "axios";

const fallbackBaseUrl = "http://localhost:3001/api";
const baseURL = process.env.NEXT_PUBLIC_URL_BE || fallbackBaseUrl;

if (!process.env.NEXT_PUBLIC_URL_BE) {
  // eslint-disable-next-line no-console
}

export const apiCall = axios.create({
  baseURL,
  withCredentials: true,
});
