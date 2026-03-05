import { Box, Button, Modal, Divider, Grid, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SecurityIcon from '@mui/icons-material/Security';
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
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    outline: "none"
};

const paymentMethods = [
    { value: "RAZORPAY", label: "Razorpay", icon: <CreditCardIcon sx={{ color: '#D97706' }} /> },
    { value: "STRIPE", label: "Stripe", icon: <AccountBalanceIcon sx={{ color: '#D97706' }} /> },
    { value: "COD", label: "Cash on Delivery", icon: <LocalAtmIcon sx={{ color: '#D97706' }} /> },
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
        setSelectedAddress(addressData); // Set as selected (temporary or needs save?)
        // Ideally, we might want to save it to backend user profile first, 
        // but for now, we just use it for the order.
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
        // MAIN BACKGROUND: Warm Cream
        <div className="bg-[#FDFBF7] min-h-screen pt-10 pb-24 px-4 lg:px-20 selection:bg-[#F9B233] selection:text-[#3E2C1E]">

            {/* Decorative Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8D5A46] rounded-full mix-blend-multiply filter blur-[100px] opacity-10"></div>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* LEFT COLUMN: Address & Payment */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Address Section */}
                    <section className="bg-white p-6 md:p-8 rounded-[24px] border border-[#E0D8CC] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#3E2C1E]">Select Delivery Address</h2>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleOpen}
                                sx={{
                                    textTransform: 'none',
                                    color: '#D97706',
                                    fontWeight: 'bold',
                                    border: '1px solid #F9B233',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: '#FFF8E1' }
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
                                <p className="col-span-2 text-center text-gray-500 py-4">
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
                    <section className="bg-white p-6 md:p-8 rounded-[24px] border border-[#E0D8CC] shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-[#3E2C1E] mb-6">Payment Method</h2>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.value}
                                    onClick={() => setSelectedPayment(method.value)}
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                                ${selectedPayment === method.value
                                            ? "border-[#F9B233] bg-[#FFF8E1] shadow-[0_0_0_1px_#F9B233]"
                                            : "border-[#E0D8CC] hover:border-[#D97706] bg-white"} 
                            `}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                ${selectedPayment === method.value ? "border-[#D97706]" : "border-[#A1887F]"}
                            `}>
                                        {selectedPayment === method.value && <div className="w-3 h-3 bg-[#D97706] rounded-full" />}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {method.icon}
                                        <span className={`font-semibold ${selectedPayment === method.value ? "text-[#D97706]" : "text-[#5D4037]"}`}>
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
                        <div className="bg-white p-6 rounded-[24px] border border-[#E0D8CC] shadow-lg">
                            <h2 className="text-xl font-bold text-[#3E2C1E] mb-6 border-b border-[#F5F1E8] pb-4">Order Summary</h2>

                            {/* Coupon Section */}
                            <div className="mb-4">
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
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#F9B233',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#D97706',
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleApplyCoupon}
                                        sx={{
                                            backgroundColor: '#3E2C1E',
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#5D4037'
                                            }
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {cart?.couponCode && (
                                    <div className="mt-2 p-2 bg-[#FFF8E1] border border-[#F9B233] rounded flex justify-between items-center">
                                        <span className="text-sm text-[#D97706] font-bold">Coupon "{cart.couponCode}" Applied!</span>
                                        <Button size="small" onClick={handleRemoveCoupon} sx={{ color: '#D97706', textTransform: 'none' }}>
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Billing Details: Items */}
                            <div className="space-y-3 mb-4">
                                <h3 className="text-sm font-semibold text-[#8D5A46] uppercase tracking-wider">Items</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 customer-scrollbar">
                                    {cart?.cartItems?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm text-[#5D4037]">
                                            <span className="truncate w-3/4">{item.product?.title || "Product Details Unavailable"}</span>
                                            <span className="font-medium">₹{item.sellingPrice}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Divider className="mb-4" sx={{ borderColor: '#E0D8CC' }} />

                            {/* Compact Pricing Summary */}
                            <div className="space-y-3 font-medium text-[#5D4037]">
                                <div className="flex justify-between">
                                    <span>Total Price</span>
                                    <span>₹{cart?.totalMrpPrice || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="text-[#D97706]">-₹{cart?.discount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                                <div className="flex justify-between text-lg font-bold text-[#3E2C1E]">
                                    <span>Total</span>
                                    <span>₹{cart?.totalSellingPrice || 0}</span>
                                </div>
                            </div>

                            <Divider className="my-6" sx={{ borderColor: '#E0D8CC', borderStyle: 'dashed' }} />

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading}
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.8,
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                                    color: '#3E2C1E',
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.25)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                                        transform: 'translateY(-2px)'
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
                        <div className="flex items-center justify-center gap-2 text-[#8D5A46] text-xs opacity-80 mt-4">
                            <SecurityIcon fontSize="small" sx={{ color: '#D97706' }} />
                            <span className="whitespace-nowrap font-medium">100% Secure Payments & Authentic Products</span>
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
            >
                <Box sx={style}>
                    <AddressForm onClose={handleClose} onSubmit={handleAddressSubmit} />
                </Box>
            </Modal>
        </div>
    );
};

export default Checkout;