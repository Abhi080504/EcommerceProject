import React, { useState } from 'react';
import { TextField, Box, Button, CircularProgress, Typography } from '@mui/material';
import { sendSellerOtp } from '../../../State/Auth/sellerAuthApi';
import { showToast } from '../../../context/ToastContext';

const BecomeSellerFormStep1 = ({ formik }: any) => {
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0); // Optional: for resend timer

    const handleSendOtp = async () => {
        if (!formik.values.email) {
            formik.setFieldTouched("email", true);
            showToast("Please enter email first", "warning");
            return;
        }
        try {
            setSendingOtp(true);
            // Assuming sendSellerOtp is the correct API function. 
            // Previous code used 'sellerAuthApi', I'll use what was there or the one in 'sellerRegisterApi' if that's where createSeller is.
            // checking imports in previous file... import { sendSellerOtp } from '../../../State/Auth/sellerAuthApi';
            // Wait, previous file had: import { sendSellerOtp } from '../../../State/Auth/sellerAuthApi';
            // I should use that one.
            await sendSellerOtp(formik.values.email);
            setOtpSent(true);
            showToast("OTP sent to your email successfully!", "success");
        } catch (error: any) {
            console.error("Failed to send OTP", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            setSendingOtp(false);
        }
    };

    // Custom Input Style matching the "Grow with GSPL" theme
    const inputSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF8F0', // Very light cream
            borderRadius: '8px',
            '& fieldset': { borderColor: '#FDE3CF' },
            '&:hover fieldset': { borderColor: '#F9B233' },
            '&.Mui-focused fieldset': { borderColor: '#632713' },
        },
        '& .MuiInputLabel-root': { color: '#8D5A46' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#632713' },
        '& .MuiInputBase-input': { color: '#3E2C1E' }
    };

    return (
        <Box className='space-y-6'>
            {/* Header for the Step (Optional, but valid) */}
            <div className='mb-4'>
                <h3 className='text-xl font-bold text-[#632713]'>Contact Details</h3>
            </div>

            {/* Mobile Number */}
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
                sx={inputSx}
            />

            {/* Email Address */}
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
                sx={inputSx}
            />

            {/* OTP Input */}
            <TextField
                fullWidth
                name="otp"
                label="Enter OTP"
                variant="outlined"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
                disabled={!otpSent} // Optional: Disable until sent? Image shows it enabled looking.
                // Image implies you can type. I'll leave it enabled or follow logic.
                // Logic: usually you can't enter OTP until you request it. But UI-wise it might be better to just let them type if they have it.
                // User's previous code disabled it. I will keep it disabled for better flow, OR enable it if they insist "exactly like image".
                // The image shows "Enter OTP" placeholder. Use disabled={!otpSent} for logic, but maybe styling makes it look active?
                // I'll stick to logic: disabled until sent is safer.
                sx={inputSx}
            />

            {/* Send OTP Button - Full Width Brown */}
            <Button
                fullWidth
                variant="contained"
                onClick={handleSendOtp}
                disabled={sendingOtp || !formik.values.email}
                sx={{
                    bgcolor: '#632713',
                    color: 'white',
                    py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#4a1d0e',
                        boxShadow: '0 4px 12px rgba(99, 39, 19, 0.2)'
                    },
                    '&:disabled': {
                        bgcolor: '#E0D8CC',
                        color: '#9CA3AF'
                    }
                }}
            >
                {sendingOtp ? <CircularProgress size={24} color="inherit" /> : (otpSent ? "Resend OTP" : "Send OTP to Email")}
            </Button>

            {/* Success / Resend Text */}
            {otpSent && (
                <div className='flex justify-between items-center text-sm px-1'>
                    <span className='text-green-600 font-medium'>
                        OTP sent to your email address
                    </span>
                    <button
                        type="button"
                        onClick={handleSendOtp}
                        className='text-[#D97706] font-bold hover:underline bg-transparent border-none cursor-pointer'
                        disabled={sendingOtp}
                    >
                        Resend OTP
                    </button>
                </div>
            )}
        </Box>
    );
};

export default BecomeSellerFormStep1;
