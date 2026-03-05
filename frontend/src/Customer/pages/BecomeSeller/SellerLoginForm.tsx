import { TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sellerLogin, sendSellerOtp } from "../../../State/Auth/sellerAuthApi";
import { useAppDispatch } from "../../../State/hooks";
import { loginSuccess, loadSellerProfile } from "../../../State/Auth/authSlice";

const SellerLoginForm = () => {

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: ""
    },

    onSubmit: async (values) => {
      try {
        const res = await sellerLogin(values.email, values.otp);

        console.log("VERIFY RESPONSE =", res);

        // 🔹 Fix: Access nested data
        const authData = res.data;
        console.log("JWT TOKEN (from API) =", authData.jwt);

        // 🔹 Store token
        localStorage.setItem("jwt", authData.jwt);
        if (authData.refreshToken) localStorage.setItem("refreshToken", authData.refreshToken);

        // 🔹 Update Redux
        dispatch(loginSuccess({ jwt: authData.jwt, refreshToken: authData.refreshToken }));

        setMessage("Login Successful 🎉 Loading your dashboard...");

        // 🔹 Load seller profile before navigating
        // This ensures the seller object is populated when the dashboard loads
        try {
          await dispatch(loadSellerProfile()).unwrap();
        } catch (profileErr) {
          console.error("Failed to load seller profile:", profileErr);
        }

        // 🔹 Navigate to seller dashboard
        navigate("/seller");
      }
      catch (err: any) {
        console.error("VERIFY ERROR =", err.response?.data || err);
        setMessage(err.response?.data?.message || "Invalid OTP or Login Failed");
      }
    },
  });

  // ------------- SEND OTP -------------
  const handleSendOtp = async () => {
    try {
      const res = await sendSellerOtp(formik.values.email);

      console.log("OTP RESPONSE =", res);
      console.log("BACKEND MESSAGE =", res.message);

      setOtpSent(true);
      setMessage(res.message);
    }
    catch (err: any) {
      console.error("OTP SEND ERROR =", err.response?.data || err);
      setMessage(err.response?.data?.message || "Failed to send OTP. Ensure you are registered.");
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#FDE3CF" },
      "&:hover fieldset": { borderColor: "#F8A91F" },
      "&.Mui-focused fieldset": { borderColor: "#632713" },
    },
    "& .MuiInputLabel-root": { color: "#8D5A46" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#632713" },
    "& .MuiInputBase-input": { color: "#632713", cursor: "text !important", caretColor: "#000000" },
    backgroundColor: "#FFF8F0",
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pt-10">

      <div className="space-y-2 text-center pb-4">
        <h3 className="text-xl font-bold text-[#632713]">
          Seller Login
        </h3>

        <p className="text-[#8D5A46] text-sm">
          Login using OTP sent to your email
        </p>
      </div>

      {/* EMAIL FIELD */}
      <TextField
        fullWidth
        name="email"
        label="Email Address"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={otpSent}
        sx={textFieldStyles}
      />

      {/* SEND OTP BUTTON */}
      {!otpSent && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleSendOtp}
          sx={{
            bgcolor: "#632713",
            py: 1.4,
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "16px",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#4a1d0e" },
          }}
        >
          Send OTP
        </Button>
      )}

      {/* OTP FIELD */}
      {otpSent && (
        <>
          <TextField
            fullWidth
            name="otp"
            label="Enter OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            sx={textFieldStyles}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={() => formik.handleSubmit()}
            sx={{
              bgcolor: "#632713",
              py: 1.4,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#4a1d0e" },
            }}
          >
            Verify & Login
          </Button>
        </>
      )}

      {message && (
        <p className="text-center text-sm text-[#8D5A46]">
          {message}
        </p>
      )}
    </div>
  );
};

export default SellerLoginForm;
