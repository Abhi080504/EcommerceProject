import axios from "axios";

export const apiAuth = axios.create({
  baseURL: "http://localhost:9000/api",
});

// Attach JWT automatically
apiAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired / invalid token
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("JWT expired — redirecting to login");
      localStorage.removeItem("jwt");
      window.location.href = "/become-seller";
    }
    return Promise.reject(error);
  }
);
