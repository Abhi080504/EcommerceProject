import axios from "axios";
import { showToast } from "../context/ToastContext";

export const api = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 Unauthorized (Token Refresh logic)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          const newJwt = response.data.data.jwt;
          // Guard: Only update JWT if we still have a valid refresh token. 
          // If logout happened during this request, refreshToken will be gone.
          if (localStorage.getItem("refreshToken")) {
            localStorage.setItem("jwt", newJwt);
            api.defaults.headers.common["Authorization"] = `Bearer ${newJwt}`;
            originalRequest.headers["Authorization"] = `Bearer ${newJwt}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("seller");

        // Only show toast if it's not a silent profile check
        if (!originalRequest.url?.includes("/users/profile")) {
          showToast("Session expired, please login again", "info");
        }
        // window.location.href = "/login"; // Optional: Redirect
      }
    }

    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      showToast("You are not authorized to perform this action.", "error");
    }

    // Handle 500 Server Error
    if (error.response && error.response.status === 500) {
      showToast("Server error. Please try again later.", "error");
    }

    // Handle 404 Not Found (Optional, can be noisy)
    if (error.response && error.response.status === 404) {
      // showToast("Resource not found", "warning"); 
    }

    // Network Error
    if (!error.response) {
      showToast("Network error. Please check your connection.", "error");
    }

    return Promise.reject(error);
  }
);
