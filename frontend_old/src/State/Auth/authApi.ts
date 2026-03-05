import { api } from "../../config/Api";
import { apiAuth } from "../../config/axiosAuth";

export const fetchSellerProfile = async () => {
  console.log("➡️ Calling /sellers/profile API");
  const res = await apiAuth.get("/sellers/profile");
  console.log("✅ Seller profile response:", res.data);
  return res.data;
};

// Get Logged-in User Profile
export const getUserProfile = async () => {
    try {
        const res = await api.get("/api/users/profile");
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
