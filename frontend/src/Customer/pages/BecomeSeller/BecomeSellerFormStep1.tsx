import React, { useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import {
  sendSellerOtp,
  verifySellerOtp,
} from "../../../State/Auth/sellerAuthApi";

const BecomeSellerFormStep1 = ({ formik }: any) => {
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      setError(null);
      await sendSellerOtp(formik.values.email); // ✅ EMAIL
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifying(true);
      await verifySellerOtp(formik.values.otp, formik.values.email);
      formik.setFieldValue("isOtpVerified", true); // ✅ unlock next step
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  // Theme styles (unchanged)
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#FDE3CF" },
      "&:hover fieldset": { borderColor: "#F8A91F" },
      "&.Mui-focused fieldset": { borderColor: "#632713" },
    },
    "& .MuiInputLabel-root": { color: "#8D5A46" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#632713" },
    "& .MuiInputBase-input": { color: "#632713" },
    backgroundColor: "#FFF8F0",
  };

  return (
    <Box className="space-y-5">
      <h3 className="text-xl font-bold text-[#632713]">
        Contact Details
      </h3>

      <TextField
        fullWidth
        name="mobile"
        label="Mobile Number"
        variant="outlined"
        value={formik.values.mobile}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile}
        sx={textFieldStyles}
      />

      {/* ✅ EMAIL FIELD (replaces mobile) */}
      <TextField
        fullWidth
        name="email"
        label="Email Address"
        variant="outlined"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={textFieldStyles}
      />

      {/* OTP FIELD */}
      <div className="space-y-2">
        <TextField
          fullWidth
          name="otp"
          label="Enter OTP"
          variant="outlined"
          value={formik.values.otp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={textFieldStyles}
        />

        {!otpSent && (
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#632713", mt: 2 }}
            onClick={handleSendOtp}
          >
            Send OTP to Email
          </Button>
        )}

        {otpSent && (
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#632713",
              color: "#632713",
              mt: 2,
            }}
            onClick={handleVerifyOtp}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </Button>
        )}

        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}

        {/* INFO TEXT */}
        <div className="flex justify-between items-center px-1">
          <Typography variant="caption" sx={{ color: "#8D5A46" }}>
            OTP sent to your email address
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#EC6426",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleSendOtp}
          >
            Resend OTP
          </Typography>
        </div>
      </div>
    </Box>
  );
};

export default BecomeSellerFormStep1;
