import { api } from "../../config/Api";

// Send OTP for Login or Signup
// Logic: If Login, email should be prefixed with "signin_" by the caller if we want to check user existence.
export const sendAuthOtp = async (email: string, role: "ROLE_CUSTOMER" | "ROLE_SELLER" | "ROLE_ADMIN" | "ROLE_SUPER" = "ROLE_CUSTOMER") => {
    try {
        const res = await api.post("auth/send/login-signup-otp", {
            email,
            role
        });
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Customer Login (Verify OTP)
export const customerLogin = async (loginData: { email: string; otp: string }) => {
    try {
        const res = await api.post("auth/signing", loginData);
        // Backend returns ApiResponse<AuthResponse>. We need AuthResponse.
        return res.data.data;
    } catch (error: any) {
        console.error("Login Error Details:", error.response);
        throw error.response?.data || error.message;
    }
};

// Customer Registration (Verify OTP + Create User)
export const customerRegister = async (registerData: { email: string; fullName: string; mobile: string; otp: string; role?: string }) => {
    try {
        const res = await api.post("auth/signup", registerData);
        return res.data.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
