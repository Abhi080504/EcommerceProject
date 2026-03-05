import { TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { sendSellerOtp, sellerLogin } from '../../../State/Auth/sellerAuthApi'
import { useAppDispatch } from '../../../State/hooks'
import { useNavigate } from "react-router-dom";
import { setSellerAuth } from '../../../State/Auth/authSlice'
import { showToast } from '../../../context/ToastContext'

const SellerLoginForm = () => {
    const [showOtp, setShowOtp] = useState(false);
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
                console.log("🟢 LOGIN API RESPONSE:", res);
                if (res.data && res.data.jwt) {
                    console.log("🟢 JWT RECEIVED:", res.data.jwt);
                } else {
                    console.error("🔴 NO JWT IN RESPONSE:", res);
                }

                dispatch(setSellerAuth(res.data));
                showToast("Logged in successfully!", "success");
                navigate("/seller", { replace: true });
            } catch (err) {
                console.error("Login Error", err);
                showToast("Login failed. Please check your OTP.", "error");
            }
        }
    })

    const handleSendOtp = async () => {
        if (!formik.values.email) {
            showToast("Please enter your email address.", "error");
            return;
        }
        try {
            await sendSellerOtp(formik.values.email);
            setShowOtp(true);
            showToast("OTP sent to your email!", "success");
        } catch (err: any) {
            console.error("OTP Error", err);
            const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
            showToast(errorMessage, "error");
        }
    }

    // Custom styles for TextFields (Matches SellerAccountForm)
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#FDE3CF' }, // Default Cream border
            '&:hover fieldset': { borderColor: '#F8A91F' }, // Hover Yellow border
            '&.Mui-focused fieldset': { borderColor: '#632713' }, // Focused Brown border
        },
        '& .MuiInputLabel-root': { color: '#8D5A46' }, // Light Brown Label
        '& .MuiInputLabel-root.Mui-focused': { color: '#632713' }, // Focused Label
        '& .MuiInputBase-input': { color: '#632713' }, // Input Text
        backgroundColor: '#FFF8F0', // Light Cream Background
    };

    return (
        <form onSubmit={formik.handleSubmit} className='space-y-6 max-w-md mx-auto pt-10'>
            <div className='space-y-2 text-center pb-4'>
                {/* Text changed to Brown */}
                <h3 className='text-xl font-bold text-[#632713]'>Welcome Back!</h3>
                {/* Subtitle changed to Lighter Brown */}
                <p className='text-[#8D5A46] text-sm'>
                    {!showOtp ? "Enter your email to receive an OTP and access your dashboard." : "OTP sent to your email. Please enter it below."}
                </p>
            </div>

            <TextField
                fullWidth
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={textFieldStyles}
            />

            {showOtp && (
                <TextField
                    fullWidth
                    name="otp"
                    label="OTP"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={textFieldStyles}
                />
            )}

            <div className='pt-2'>
                {!showOtp ? (
                    <Button
                        fullWidth
                        variant='contained'
                        onClick={handleSendOtp}
                        sx={{
                            bgcolor: '#632713', // Button Background -> BROWN
                            py: 1.5,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '16px',
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#4a1d0e' } // Darker Brown on hover
                        }}
                    >
                        Send OTP
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        type="submit"
                        variant='contained'
                        sx={{
                            bgcolor: '#632713', // Button Background -> BROWN
                            py: 1.5,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '16px',
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#4a1d0e' } // Darker Brown on hover
                        }}
                    >
                        Login
                    </Button>
                )}
            </div>

            <div className='text-center'>
                {/* Replaced invalid anchor with a button to fix ESLint jsx-a11y/anchor-is-valid */}
                <button
                    type="button"
                    className='text-sm text-[#EC6426] font-semibold hover:underline bg-transparent border-none cursor-pointer'
                    onClick={() => console.log("Forgot password logic")}
                >
                    Forgot Password?
                </button>
            </div>
        </form>
    )
}

export default SellerLoginForm;
