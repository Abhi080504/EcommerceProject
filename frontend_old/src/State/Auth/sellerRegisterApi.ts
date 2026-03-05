import { api } from "../../config/Api";

/* -----------------------------
   CREATE SELLER
----------------------------- */
export const createSeller = async (data: any) => {
  const res = await api.post("/sellers", data);
  return res.data;
};

/* -----------------------------
   VERIFY OTP
----------------------------- */
export const verifySellerOtp = async (otp: string) => {
  const res = await api.patch(`/sellers/verify/${otp}`);
  return res.data;
};
