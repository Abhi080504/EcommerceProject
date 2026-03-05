import React, { useState } from "react";
import { useFormik } from "formik";
import { TextField, Button, Box, Typography, Alert, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { customerLogin, customerRegister, sendAuthOtp } from "../../../State/Auth/customerAuthApi";
import { loginSuccess, loadUserProfile } from "../../../State/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminLogin = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { jwt, user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (jwt && user) {
            if (user.role === "ROLE_SUPER") {
                navigate("/super-admin");
            } else if (user.role === "ROLE_ADMIN") {
                navigate("/admin");
            }
        }
    }, [jwt, user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: "",
            mobile: "",
        },
        onSubmit: async (values) => {
            // handled by custom buttons
        },
    });

    const handleSendOtp = async () => {
        setError("");
        try {
            const prefix = isRegister ? "" : "signin_";
            const role = formik.values.email === "superadmin@ecommerce.com" ? "ROLE_SUPER" : "ROLE_ADMIN";
            await sendAuthOtp(prefix + formik.values.email, role);
            setOtpSent(true);
        } catch (err: any) {
            console.error("Auth Error", err);
            setError(err.message || "Failed to send OTP");
        }
    };

    const handleLogin = async () => {
        setError("");
        try {
            const res = await customerLogin({ email: "signin_" + formik.values.email, otp: formik.values.otp });
            if (res.jwt) {
                localStorage.setItem("jwt", res.jwt);
                if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
                dispatch(loginSuccess({ jwt: res.jwt, refreshToken: res.refreshToken }));
                dispatch(loadUserProfile());

                // Fix: Load user profile so AdminDashboard knows the role immediately
                const userProfile = await dispatch(loadUserProfile()).unwrap();
                // We use unwrap() to wait for the result or catch error, 
                // though handleLogin catch block will handle rejection if we don't unwrap, 
                // but we want to ensure user is in store before navigation if possible

                // OR just dispatch it and let Redux handle state update. 
                // simple dispatch is safer to avoid unhandled promise rejections if unwrap fails differently.
                // But we need to import loadUserProfile.


                if (res.role === "ROLE_SUPER") {
                    navigate("/super-admin");
                } else {
                    navigate("/admin");
                }
            }
        } catch (err: any) {
            setError(err.message || "Login Failed");
        }
    };

    const handleRegister = async () => {
        setError("");
        try {
            const res = await customerRegister({
                email: formik.values.email,
                fullName: formik.values.fullName,
                mobile: formik.values.mobile,
                otp: formik.values.otp,
                role: "ROLE_ADMIN"
            });
            if (res.jwt) {
                setIsRegister(false);
                setOtpSent(false);
                formik.resetForm();
                formik.resetForm();
                dispatch(loginSuccess({ jwt: res.jwt, refreshToken: res.refreshToken }));
                setError("Registration Successful! Please Login.");
            }
        } catch (err: any) {
            setError(err.message || "Registration Failed");
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setOtpSent(false);
        setError("");
        formik.resetForm();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#f8fafc] z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-100 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <Paper
                elevation={0}
                className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
                <div className="text-center mb-8">
                    <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                        Admin {isRegister ? "Register" : "Portal"}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                        {isRegister ? "Create your admin credentials" : "Welcome back, please login to continue"}
                    </Typography>
                </div>

                {error && (
                    <Alert
                        severity={error.startsWith("Registration Successful") ? "success" : "error"}
                        className="mb-6 rounded-lg"
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                )}

                <div className="space-y-5">
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        disabled={otpSent}
                        InputProps={{
                            sx: { borderRadius: '10px' }
                        }}
                    />

                    {isRegister && (
                        <>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { borderRadius: '10px', "& input": { cursor: "text !important", caretColor: "#000000" } }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobile"
                                value={formik.values.mobile}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { borderRadius: '10px', "& input": { cursor: "text !important", caretColor: "#000000" } }
                                }}
                            />
                        </>
                    )}

                    {!otpSent && (
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSendOtp}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                backgroundColor: '#0f172a',
                                boxShadow: '0 4px 6px -1px rgb(15 23 42 / 0.3)',
                                '&:hover': {
                                    backgroundColor: '#334155',
                                    boxShadow: '0 10px 15px -3px rgb(15 23 42 / 0.3)'
                                }
                            }}
                        >
                            {isRegister ? "Send Signup OTP" : "Send Login OTP"}
                        </Button>
                    )}

                    {otpSent && (
                        <>
                            <TextField
                                fullWidth
                                label="Enter OTP"
                                name="otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                InputProps={{
                                    sx: { borderRadius: '10px', "& input": { cursor: "text !important", caretColor: "#000000" } }
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={isRegister ? handleRegister : handleLogin}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    backgroundColor: '#0f172a',
                                    boxShadow: '0 4px 6px -1px rgb(15 23 42 / 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#334155',
                                        boxShadow: '0 10px 15px -3px rgb(15 23 42 / 0.3)'
                                    }
                                }}
                            >
                                {isRegister ? "Complete Registration" : "Login to Dashboard"}
                            </Button>
                        </>
                    )}

                    <div className="text-center mt-4">
                        <Button
                            onClick={toggleMode}
                            sx={{
                                textTransform: 'none',
                                color: '#64748b',
                                '&:hover': { backgroundColor: 'transparent', color: '#0f172a' }
                            }}
                        >
                            {isRegister ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default AdminLogin;
