import { Box, Button, Modal, Divider, TextField, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import AddIcon from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SecurityIcon from '@mui/icons-material/Security';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { fetchUserCart } from "../../../State/Cart/cartThunks";
import { loadUserProfile } from "../../../State/Auth/authSlice";
import { createOrder } from "../../../State/Order/orderThunks";
import { applyCoupon } from "../../../State/Cart/cartThunks";
import { useNavigate } from "react-router-dom";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    maxWidth: '90vw',
    bgcolor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(62, 44, 30, 0.25)",
    p: 5,
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    outline: "none"
};

const paymentMethods = [
    { value: "RAZORPAY", label: "Razorpay", icon: <CreditCardIcon sx={{ color: '#F9B233' }} /> },
    { value: "STRIPE", label: "Stripe", icon: <AccountBalanceIcon sx={{ color: '#F9B233' }} /> },
    { value: "COD", label: "Cash on Delivery", icon: <LocalAtmIcon sx={{ color: '#F9B233' }} /> },
];

const Checkout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // State for Selection
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState("RAZORPAY");
    const [couponCode, setCouponCode] = useState("");

    // Redux State
    const { user } = useAppSelector((state) => state.auth);
    const { cart } = useAppSelector((state) => state.cart);
    const { paymentLink, loading: orderLoading, error: orderError } = useAppSelector((state) => state.order);

    // Load Data
    useEffect(() => {
        dispatch(loadUserProfile());
        dispatch(fetchUserCart());
    }, [dispatch]);

    useEffect(() => {
        if (orderError) {
            console.error("Order Creation Error:", orderError);
            alert("Failed to create order: " + (orderError.message || orderError));
        }
    }, [orderError]);

    // Handle Payment Link Redirect
    useEffect(() => {
        if (paymentLink) {
            console.log("Redirecting to Payment Link:", paymentLink);
            window.location.href = paymentLink;
        }
    }, [paymentLink]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Handle Address Selection from User Profile
    const handleSelectAddress = (address: any) => {
        setSelectedAddress(address);
    }

    // Handle New Address Form Submit
    const handleAddressSubmit = (addressData: any) => {
        setSelectedAddress(addressData);
        setOpen(false);
    }

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            alert("Please select or add a delivery address.");
            return;
        }

        const orderReq = {
            address: selectedAddress,
            paymentMethod: selectedPayment as "RAZORPAY" | "STRIPE" | "COD"
        };

        dispatch(createOrder(orderReq));
    };

    const handleApplyCoupon = () => {
        if (!couponCode) {
            alert("Please enter a coupon code");
            return;
        }
        dispatch(applyCoupon({
            apply: "true",
            code: couponCode,
            orderValue: cart?.totalSellingPrice || 0
        }));
    };

    const handleRemoveCoupon = () => {
        if (!cart?.couponCode) return;
        dispatch(applyCoupon({
            apply: "false",
            code: cart.couponCode,
            orderValue: cart?.totalSellingPrice || 0
        }));
        setCouponCode("");
    };


    return (
        <div className="bg-[#F5F1E8] min-h-screen pt-10 pb-24 px-4 lg:px-20 selection:bg-[#F9B233] selection:text-[#3E2C1E] relative overflow-hidden">

            {/* Decorative Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3E2C1E] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-[#FDF6E3] rounded-full mix-blend-multiply filter blur-[90px] opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="max-w-[1200px] mx-auto mb-8 px-4 lg:px-0 relative z-10">
                <div className="flex items-center gap-4">
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: '#3E2C1E',
                            bgcolor: 'white/50',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: '0 4px 15px rgba(62,44,30,0.08)',
                            '&:hover': {
                                bgcolor: '#F9B233',
                                color: 'white',
                                border: '1px solid #F9B233',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(249,178,51,0.3)'
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <h1 className="text-4xl font-black text-[#3E2C1E] tracking-tight">
                        Checkout
                    </h1>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* LEFT COLUMN: Address & Payment */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Address Section */}
                    <section className="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[28px] border border-white/70 shadow-[0_10px_40px_-10px_rgba(62,44,30,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(62,44,30,0.15)] transition-all duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-[#3E2C1E] tracking-tight">Select Delivery Address</h2>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleOpen}
                                sx={{
                                    textTransform: 'none',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                                    borderRadius: '12px',
                                    padding: '8px 20px',
                                    boxShadow: '0 4px 12px rgba(249,178,51,0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(249,178,51,0.4)'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                Add New
                            </Button>
                        </div>

                        {/* List User Addresses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user?.addresses?.map((item: any) => (
                                <AddressCard
                                    key={item.id}
                                    address={item}
                                    selected={selectedAddress === item || selectedAddress?.id === item.id}
                                    onSelect={() => handleSelectAddress(item)}
                                />
                            ))}
                            {!user?.addresses?.length && (
                                <p className="col-span-2 text-center text-[#8D5A46] py-8 font-medium bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60">
                                    No saved addresses. Please add a new one.
                                </p>
                            )}
                            {/* Show Selected (if created manually and not in list yet) */}
                            {selectedAddress && !selectedAddress.id && (
                                <AddressCard
                                    address={selectedAddress}
                                    selected={true}
                                    onSelect={() => { }}
                                />
                            )}
                        </div>
                    </section>

                    {/* 2. Payment Section */}
                    <section className="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[28px] border border-white/70 shadow-[0_10px_40px_-10px_rgba(62,44,30,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(62,44,30,0.15)] transition-all duration-500">
                        <h2 className="text-2xl font-black text-[#3E2C1E] mb-6 tracking-tight">Payment Method</h2>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.value}
                                    onClick={() => setSelectedPayment(method.value)}
                                    className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-300
                                ${selectedPayment === method.value
                                            ? "border-[#F9B233] bg-gradient-to-r from-[#FFF8E1] to-[#FFF8F0] shadow-[0_0_0_2px_#F9B233] scale-[1.02]"
                                            : "border-white/70 hover:border-[#F9B233]/50 bg-white/40 backdrop-blur-sm hover:bg-white/60"} 
                            `}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                ${selectedPayment === method.value ? "border-[#F9B233] bg-white" : "border-[#A1887F]"}
                            `}>
                                        {selectedPayment === method.value && <div className="w-3.5 h-3.5 bg-gradient-to-br from-[#F9B233] to-[#D97706] rounded-full" />}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {method.icon}
                                        <span className={`font-bold text-lg ${selectedPayment === method.value ? "text-[#3E2C1E]" : "text-[#5D4037]"}`}>
                                            {method.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Bill Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <div className="bg-white/50 backdrop-blur-md p-7 rounded-[32px] border border-white/70 shadow-[0_20px_50px_-10px_rgba(62,44,30,0.1)]">
                            <h2 className="text-2xl font-black text-[#3E2C1E] mb-6 pb-4 border-b-2 border-[#F9B233]/20 tracking-tight">Order Summary</h2>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <TextField
                                        label="Coupon Code"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#F9B233',
                                                    borderWidth: '2px'
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#F9B233',
                                                fontWeight: 'bold'
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleApplyCoupon}
                                        sx={{
                                            background: 'linear-gradient(135deg, #3E2C1E 0%, #5D4037 100%)',
                                            color: 'white',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            borderRadius: '12px',
                                            padding: '8px 24px',
                                            boxShadow: '0 4px 12px rgba(62,44,30,0.2)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5D4037 0%, #6D4C41 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(62,44,30,0.3)'
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {cart?.couponCode && (
                                    <div className="mt-3 p-3 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E1] border-2 border-[#0C831F]/30 rounded-xl flex justify-between items-center shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <LocalOfferIcon sx={{ color: '#F9B233', fontSize: 18 }} />
                                            <span className="text-sm text-[#0C831F] font-bold">Coupon "{cart.couponCode}" Applied!</span>
                                        </div>
                                        <Button
                                            size="small"
                                            onClick={handleRemoveCoupon}
                                            sx={{
                                                color: '#D32F2F',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                '&:hover': { bgcolor: '#FFEBEE' }
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Billing Details: Items */}
                            <div className="space-y-3 mb-5">
                                <h3 className="text-sm font-black text-[#8D5A46] uppercase tracking-wider">Items in Cart</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {cart?.cartItems?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm text-[#5D4037] bg-white/40 backdrop-blur-sm p-2 rounded-lg">
                                            <span className="truncate w-3/4 font-medium">{item.product.title}</span>
                                            <span className="font-bold text-[#3E2C1E]">₹{item.sellingPrice}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Divider sx={{ borderColor: '#F9B233', opacity: 0.3, borderWidth: 1, my: 3 }} />

                            {/* Compact Pricing Summary */}
                            <div className="space-y-4 font-semibold text-[#5D4037]">
                                <div className="flex justify-between text-base">
                                    <span>Total Price</span>
                                    <span className="font-bold">₹{cart?.totalMrpPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span>Discount</span>
                                    <span className="text-[#0C831F] font-bold">-₹{cart?.discount || 0}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span>Shipping</span>
                                    <span className="text-[#0C831F] font-bold">FREE</span>
                                </div>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#F9B233', opacity: 0.4, borderWidth: 1.5 }} />
                                <div className="flex justify-between items-center bg-gradient-to-r from-[#FFF8F0] to-[#FFF8E1] rounded-2xl p-4 shadow-sm">
                                    <span className="text-xl font-black text-[#3E2C1E]">Total Amount</span>
                                    <span className="text-2xl font-black text-[#3E2C1E]">₹{cart?.totalSellingPrice || 0}</span>
                                </div>
                            </div>

                            <Divider sx={{ borderColor: '#F9B233', opacity: 0.3, borderWidth: 1, my: 4 }} />

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading}
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 2,
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 25px rgba(249, 178, 51, 0.3)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 15px 35px rgba(249, 178, 51, 0.4)'
                                    },
                                    '&:disabled': {
                                        background: '#E0D8CC',
                                        color: '#A1887F'
                                    }
                                }}
                            >
                                {orderLoading ? "Processing..." : "Place Order"}
                            </Button>
                        </div>

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-2 text-[#8D5A46] text-xs font-semibold bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/60">
                            <SecurityIcon sx={{ fontSize: 16, color: '#0C831F' }} />
                            <span className="whitespace-nowrap">100% Secure Payments & Authentic Products</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Address Form Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                slotProps={{
                    backdrop: {
                        sx: {
                            backdropFilter: 'blur(8px)',
                            backgroundColor: 'rgba(62, 44, 30, 0.3)'
                        }
                    }
                }}
            >
                <Box sx={style}>
                    <AddressForm onClose={handleClose} onSubmit={handleAddressSubmit} />
                </Box>
            </Modal>

            {/* CSS for Animations */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(249, 178, 51, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #F9B233 0%, #D97706 100%);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #FFCA28 0%, #FFA000 100%);
                }
            `}</style>
        </div>
    );
};

export default Checkout;