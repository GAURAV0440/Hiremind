import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

export const api = axios.create({
  baseURL,
  timeout: 120_000,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      error.message = detail;
    }
    return Promise.reject(error);
  },
);
