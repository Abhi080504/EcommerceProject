import { api } from "../../config/Api";

/**
 * 🔹 Send OTP to seller email
 * We use the existing /auth/send/login-signup-otp endpoint 
 * because it's designed to send OTPs without validating a password/code yet.
 */
export const sendSellerOtp = async (email: string) => {
  // Use your working AuthController endpoint
  const res = await api.post("auth/send/login-signup-otp", {
    email,
    role: "ROLE_SELLER" // This tells the backend it's for a seller
  });

  return res.data;
};

/**
 * 🔹 Final Login (Called after user enters OTP)
 */
export const sellerLogin = async (email: string, otp: string) => {
  const res = await api.post("sellers/login", {
    email,
    otp
  });

  return res.data;
};

export const verifySellerOtp = async (otp: string, email: string) => {
  const res = await api.post("auth/verify/otp", {
    email,
    otp
  });

  return res.data;
};