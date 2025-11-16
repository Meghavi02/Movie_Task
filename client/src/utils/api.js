import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Attach token to ALL requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;   // ★★★ VERY IMPORTANT
  }
  return config;
});

export default api;
