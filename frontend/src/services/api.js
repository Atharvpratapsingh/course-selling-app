import axios from "axios";

// Backend ka base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance — sare API calls ke liye reusable
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor — har request mein automatically token add karega
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;