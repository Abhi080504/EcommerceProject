import axios from "axios";

export const apiAuth = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
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
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Refresh logic)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          console.log("🔄 apiAuth: Attempting token refresh...");
          const response = await axios.post("http://localhost:9000/api/auth/refresh", {
            refreshToken: refreshToken
          });
          const newJwt = response.data.jwt;

          if (localStorage.getItem("refreshToken")) {
            localStorage.setItem("jwt", newJwt);
            apiAuth.defaults.headers.common["Authorization"] = `Bearer ${newJwt}`;
            originalRequest.headers["Authorization"] = `Bearer ${newJwt}`;
            return apiAuth(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("❌ apiAuth: Refresh failed, redirecting to login");
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("seller");

        // Only redirect if NOT on public pages (though apiAuth usually isn't)
        window.location.href = "/become-seller";
      }
    }

    if (error.response?.status === 403) {
      console.warn("Forbidden — redirecting to become-seller");
      window.location.href = "/become-seller";
    }

    return Promise.reject(error);
  }
);
