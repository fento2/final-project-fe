import axios from "axios";

const fallbackBaseUrl = "http://localhost:3001/api";
const baseURL = process.env.NEXT_PUBLIC_URL_BE || fallbackBaseUrl;

if (!process.env.NEXT_PUBLIC_URL_BE) {
  // eslint-disable-next-line no-console
  console.warn(
    `[apiCall] NEXT_PUBLIC_URL_BE is not set. Falling back to ${fallbackBaseUrl}. Set NEXT_PUBLIC_URL_BE in your environment for production.`
  );
}

export const apiCall = axios.create({
  baseURL,
  withCredentials: true,
});
