import React, { useState } from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    Alert,
    CircularProgress
} from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginSchema, emailSchema, registerSchema, registerVerifySchema } from "../../../utils/validationSchemas";
import {
    sendAuthOtp,
    customerLogin,
    customerRegister
} from "../../../State/Auth/customerAuthApi";
import { useAppDispatch } from "../../../State/hooks";
import { loadUserProfile } from "../../../State/Auth/authSlice";
import { addItemToCart, fetchUserCart } from "../../../State/Cart/cartThunks";

interface AuthModalProps {
    open: boolean;
    handleClose: () => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    outline: "none",
    bgcolor: '#FDFBF7',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    p: 4,
};

const AuthModal: React.FC<AuthModalProps> = ({ open, handleClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(0);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 🔹 Helper: Sync Guest Cart to Backend
    const syncGuestCart = async () => {
        const guestCartJson = localStorage.getItem("guest_cart");
        if (guestCartJson) {
            const guestCart = JSON.parse(guestCartJson);
            const items = guestCart.cartItems || [];

            if (items.length > 0) {
                // We sequentially add items to ensure no race conditions with backend cart
                for (const item of items) {
                    await dispatch(addItemToCart({
                        productId: item.product.id,
                        size: item.size,
                        quantity: item.quantity
                    }));
                }
            }
            // Clear guest cart
            localStorage.removeItem("guest_cart");
            // Fetch updated backend cart
            dispatch(fetchUserCart());
        }
    };

    /* =====================
       LOGIN FORM
    ===================== */
    const loginForm = useFormik({
        initialValues: { email: "", otp: "" },
        validationSchema: otpSent ? loginSchema : emailSchema,
        onSubmit: async (values) => {
            if (!otpSent) {
                // SEND OTP
                try {
                    setLoading(true);
                    setErrorMsg("");
                    await sendAuthOtp("signin_" + values.email, "ROLE_CUSTOMER");
                    setOtpSent(true);
                    alert("OTP Sent to " + values.email);
                } catch (err: any) {
                    setErrorMsg(err.message || "Failed to send OTP");
                } finally {
                    setLoading(false);
                }
            } else {
                // LOGIN
                try {
                    setLoading(true);
                    setErrorMsg("");
                    const res = await customerLogin(values);

                    if (res.jwt) {
                        localStorage.setItem("jwt", res.jwt);
                        if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);

                        // 🔥 LOAD USER PROFILE INTO REDUX
                        const userAction = await dispatch(loadUserProfile());
                        // Check if payload exists and has role
                        if (loadUserProfile.fulfilled.match(userAction)) {
                            const user = userAction.payload;
                            if (user?.role === "ROLE_SUPER") {
                                navigate("/super-admin");
                            }
                        }

                        // 🔹 Sync Guest Cart
                        await syncGuestCart();

                        alert("Login Successful");
                        handleClose();
                    }
                } catch (err: any) {
                    setErrorMsg(err.message || "Login Failed");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    /* =====================
       REGISTER FORM
    ===================== */
    const registerForm = useFormik({
        initialValues: { fullName: "", email: "", mobile: "", otp: "" },
        validationSchema: otpSent ? registerVerifySchema : registerSchema,
        onSubmit: async (values) => {
            if (!otpSent) {
                // SEND OTP
                try {
                    setLoading(true);
                    setErrorMsg("");
                    await sendAuthOtp(values.email, "ROLE_CUSTOMER");
                    setOtpSent(true);
                    alert("OTP Sent to " + values.email);
                } catch (err: any) {
                    setErrorMsg(err.message || "Failed to send OTP");
                } finally {
                    setLoading(false);
                }
            } else {
                // REGISTER
                try {
                    setLoading(true);
                    setErrorMsg("");
                    const res = await customerRegister(values);

                    if (res.jwt) {
                        localStorage.setItem("jwt", res.jwt);
                        if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);

                        // 🔥 LOAD USER PROFILE AFTER REGISTER
                        await dispatch(loadUserProfile());

                        // 🔹 Sync Guest Cart
                        await syncGuestCart();

                        alert("Registration Successful");
                        handleClose();
                    }
                } catch (err: any) {
                    setErrorMsg(err.message || "Registration Failed");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setOtpSent(false);
        setErrorMsg("");
        loginForm.resetForm();
        registerForm.resetForm();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        TabIndicatorProps={{ style: { backgroundColor: '#F9B233' } }}
                    >
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                </Box>

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

                {/* LOGIN */}
                {activeTab === 0 && (
                    <form onSubmit={loginForm.handleSubmit} className="space-y-4">
                        <TextField
                            sx={{ "& .MuiInputBase-input": { cursor: "text !important", caretColor: "#000000" }, "&:hover": { cursor: "text !important" } }}
                            fullWidth
                            name="email"
                            label="Email Address"
                            value={loginForm.values.email}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                            error={loginForm.touched.email && Boolean(loginForm.errors.email)}
                            helperText={loginForm.touched.email && loginForm.errors.email}
                            disabled={otpSent}
                        />

                        {otpSent && (
                            <TextField
                                sx={{ "& .MuiInputBase-input": { cursor: "text" } }}
                                fullWidth
                                name="otp"
                                label="Enter OTP"
                                value={loginForm.values.otp}
                                onChange={loginForm.handleChange}
                                onBlur={loginForm.handleBlur}
                                error={loginForm.touched.otp && Boolean(loginForm.errors.otp)}
                                helperText={loginForm.touched.otp && loginForm.errors.otp}
                            />
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            sx={{ bgcolor: '#F9B233', color: '#3E2C1E', fontWeight: 'bold' }}
                        >
                            {loading ? <CircularProgress size={24} /> : (otpSent ? "Login" : "Send OTP")}
                        </Button>
                    </form>
                )}

                {/* REGISTER */}
                {activeTab === 1 && (
                    <form onSubmit={registerForm.handleSubmit} className="space-y-4">
                        <TextField
                            sx={{ "& .MuiInputBase-input": { cursor: "text !important", caretColor: "#000000" }, "&:hover": { cursor: "text !important" } }}
                            fullWidth
                            name="fullName"
                            label="Full Name"
                            value={registerForm.values.fullName}
                            onChange={registerForm.handleChange}
                            onBlur={registerForm.handleBlur}
                            disabled={otpSent}
                        />

                        <TextField
                            sx={{ "& .MuiInputBase-input": { cursor: "text !important", caretColor: "#000000" }, "&:hover": { cursor: "text !important" } }}
                            fullWidth
                            name="email"
                            label="Email Address"
                            value={registerForm.values.email}
                            onChange={registerForm.handleChange}
                            onBlur={registerForm.handleBlur}
                            disabled={otpSent}
                        />

                        <TextField
                            sx={{ "& .MuiInputBase-input": { cursor: "text !important", caretColor: "#000000" }, "&:hover": { cursor: "text !important" } }}
                            fullWidth
                            name="mobile"
                            label="Mobile Number"
                            value={registerForm.values.mobile}
                            onChange={registerForm.handleChange}
                            onBlur={registerForm.handleBlur}
                            disabled={otpSent}
                        />

                        {otpSent && (
                            <TextField
                                sx={{ "& .MuiInputBase-input": { cursor: "text" } }}
                                fullWidth
                                name="otp"
                                label="Enter OTP"
                                value={registerForm.values.otp}
                                onChange={registerForm.handleChange}
                                onBlur={registerForm.handleBlur}
                            />
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            sx={{ bgcolor: '#F9B233', color: '#3E2C1E', fontWeight: 'bold' }}
                        >
                            {loading ? <CircularProgress size={24} /> : (otpSent ? "Register" : "Send OTP")}
                        </Button>
                    </form>
                )}

            </Box>
        </Modal>
    );
};

export default AuthModal;
