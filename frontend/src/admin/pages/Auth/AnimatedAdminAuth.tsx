import React, { useState } from "react";
import { useFormik } from "formik";
import { TextField, Button, Alert, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { customerLogin, customerRegister, sendAuthOtp } from "../../../State/Auth/customerAuthApi";
import { loginSuccess, loadUserProfile } from "../../../State/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const AnimatedAdminAuth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
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
            const prefix = isSignUp ? "" : "signin_";
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
                await dispatch(loadUserProfile()).unwrap();

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
                setIsSignUp(false);
                setOtpSent(false);
                formik.resetForm();
                dispatch(loginSuccess({ jwt: res.jwt, refreshToken: res.refreshToken }));
                setError("Registration Successful! Please Login.");
            }
        } catch (err: any) {
            setError(err.message || "Registration Failed");
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setOtpSent(false);
        setError("");
        formik.resetForm();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a4d45] via-[#00927c] to-[#0f9f8f] overflow-hidden relative">
            {/* Geometric Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                {/* Animated floating circles */}
                <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                {/* Top Right Corner Geometric Shape */}
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-[#f59e0b]/30 to-transparent rounded-bl-[100px] transform rotate-12"></div>
                <div className="absolute top-[-50px] right-[-50px] w-[250px] h-[250px] bg-[#f59e0b]/20 rounded-full"></div>
                
                {/* Bottom Left Corner Geometric Shape */}
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-[#fbbf24]/30 to-transparent rounded-tr-[120px]"></div>
                <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] bg-[#fbbf24]/25 transform rotate-45"></div>
                
                {/* Additional decorative elements */}
                <div className="absolute top-[20%] left-[10%] w-[150px] h-[150px] bg-white/5 rounded-full blur-[40px]"></div>
                <div className="absolute bottom-[30%] right-[15%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[50px]"></div>
                
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="relative w-full h-full flex">
                    {/* Sign Up Form */}
                    <div 
                        className={`absolute top-0 left-0 w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                            isSignUp ? 'translate-x-0 opacity-100 z-20' : 'translate-x-full opacity-0 z-10'
                        }`}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-500 mb-6">Sign up to get started</p>

                        {/* Social Icons */}
                        <div className="flex gap-3 mb-6">
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <GoogleIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <FacebookIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <TwitterIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <LinkedInIcon className="text-gray-600" />
                            </IconButton>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">or use your email for registration</p>

                        {error && (
                            <Alert 
                                severity={error.startsWith("Registration Successful") ? "success" : "error"}
                                className="mb-4 rounded-lg"
                            >
                                {error}
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Full Name"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { 
                                        borderRadius: '8px',
                                        backgroundColor: '#f3f4f6',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { 
                                        borderRadius: '8px',
                                        backgroundColor: '#f3f4f6',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Mobile Number"
                                name="mobile"
                                value={formik.values.mobile}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { 
                                        borderRadius: '8px',
                                        backgroundColor: '#f3f4f6',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />

                            {otpSent && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter OTP"
                                    name="otp"
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    InputProps={{
                                        sx: { 
                                            borderRadius: '8px',
                                            backgroundColor: '#f3f4f6',
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            )}

                            {!otpSent ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSendOtp}
                                    sx={{
                                        mt: 2,
                                        py: 1.2,
                                        borderRadius: '25px',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                                        boxShadow: '0 4px 15px rgba(0, 146, 124, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f9f8f 0%, #00927c 100%)',
                                            boxShadow: '0 6px 20px rgba(0, 146, 124, 0.6)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Send OTP
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleRegister}
                                    sx={{
                                        mt: 2,
                                        py: 1.2,
                                        borderRadius: '25px',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                                        boxShadow: '0 4px 15px rgba(0, 146, 124, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f9f8f 0%, #00927c 100%)',
                                            boxShadow: '0 6px 20px rgba(0, 146, 124, 0.6)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Sign Up
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sign In Form */}
                    <div 
                        className={`absolute top-0 right-0 w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                            !isSignUp ? 'translate-x-0 opacity-100 z-20' : '-translate-x-full opacity-0 z-10'
                        }`}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                        <p className="text-gray-500 mb-6">Welcome back to Admin Portal</p>

                        {/* Social Icons */}
                        <div className="flex gap-3 mb-6">
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <GoogleIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <FacebookIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <TwitterIcon className="text-gray-600" />
                            </IconButton>
                            <IconButton className="border border-gray-300 hover:border-[#00927c] transition-all duration-300">
                                <LinkedInIcon className="text-gray-600" />
                            </IconButton>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">or use your email account</p>

                        {error && !error.startsWith("Registration Successful") && (
                            <Alert 
                                severity="error"
                                className="mb-4 rounded-lg"
                            >
                                {error}
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                disabled={otpSent}
                                InputProps={{
                                    sx: { 
                                        borderRadius: '8px',
                                        backgroundColor: '#f3f4f6',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />

                            {otpSent && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter OTP"
                                    name="otp"
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    InputProps={{
                                        sx: { 
                                            borderRadius: '8px',
                                            backgroundColor: '#f3f4f6',
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            )}

                            {!otpSent ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSendOtp}
                                    sx={{
                                        mt: 2,
                                        py: 1.2,
                                        borderRadius: '25px',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                                        boxShadow: '0 4px 15px rgba(0, 146, 124, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f9f8f 0%, #00927c 100%)',
                                            boxShadow: '0 6px 20px rgba(0, 146, 124, 0.6)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Send Login OTP
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleLogin}
                                    sx={{
                                        mt: 2,
                                        py: 1.2,
                                        borderRadius: '25px',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                                        boxShadow: '0 4px 15px rgba(0, 146, 124, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f9f8f 0%, #00927c 100%)',
                                            boxShadow: '0 6px 20px rgba(0, 146, 124, 0.6)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Sign In
                                </Button>
                            )}

                            <button className="text-sm text-gray-500 hover:text-[#00927c] transition-colors duration-300 mt-2">
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    {/* Overlay Panel */}
                    <div 
                        className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out z-30 ${
                            isSignUp ? 'translate-x-full' : 'translate-x-0'
                        }`}
                    >
                        <div className="relative w-full h-full bg-gradient-to-br from-[#00927c] to-[#0f9f8f] flex items-center justify-center text-white p-12">
                            {/* Decorative circles */}
                            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-white/10 rounded-full"></div>
                            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] bg-white/10 rounded-full"></div>
                            
                            <div className="relative z-10 text-center">
                                {!isSignUp ? (
                                    <>
                                        <h2 className="text-4xl font-bold mb-4">Hello, Admin!</h2>
                                        <p className="mb-8 text-white/90">Enter your details and start your journey with us</p>
                                        <button
                                            onClick={toggleMode}
                                            className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#00927c] transition-all duration-300 transform hover:scale-105"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                                        <p className="mb-8 text-white/90">To keep connected with us please login with your info</p>
                                        <button
                                            onClick={toggleMode}
                                            className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#00927c] transition-all duration-300 transform hover:scale-105"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedAdminAuth;
