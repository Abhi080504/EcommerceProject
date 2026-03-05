import React, { useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { Add, Remove, DeleteOutline, ShoppingBag, LocalOffer, Shield, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { fetchUserCart, removeCartItem, updateCartItem } from '../../../State/Cart/cartThunks';
import AuthModal from '../../components/Auth/AuthModal';
import { useState } from 'react';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state) => state.cart);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUserCart());
    }, [dispatch]);

    const handleQuantityChange = (cartItemId: number, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        dispatch(updateCartItem({ cartItemId, data: { quantity: newQty } }));
        setTimeout(() => dispatch(fetchUserCart()), 200);
    };

    const handleRemoveItem = (cartItemId: number) => {
        dispatch(removeCartItem(cartItemId));
        setTimeout(() => dispatch(fetchUserCart()), 200);
    };

    // Safe Accessors
    const cartItems = cart?.cartItems || [];
    const totalItem = cart?.totalItem || 0;
    const totalSellingPrice = cart?.totalSellingPrice || 0;
    const totalMrpPrice = cart?.totalMrpPrice || 0;
    const discount = cart?.discount || 0;
    const shipping = totalSellingPrice > 500 ? 0 : 50;
    const finalTotal = totalSellingPrice + shipping;

    // --- EMPTY CART VIEW ---
    if (!loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F5F1E8] flex flex-col items-center justify-center p-4 selection:bg-[#F9B233] selection:text-[#3E2C1E]">
                {/* Background Blobs */}
                <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3E2C1E] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 animate-blob pointer-events-none"></div>
                <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="relative bg-white/60 backdrop-blur-xl p-12 rounded-[32px] border border-white/70 shadow-[0_20px_50px_rgba(62,44,30,0.1)] text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#F9B233]/20 to-[#F9B233]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#F9B233]/30">
                        <ShoppingBag sx={{ fontSize: 48, color: '#F9B233' }} />
                    </div>
                    <h2 className="text-3xl font-black text-[#3E2C1E] mb-3 tracking-tight">Your Cart is Empty</h2>
                    <p className="text-[#8D5A46] mb-8 font-medium text-lg">Looks like you haven't made your choice yet.</p>
                    <Button
                        onClick={() => navigate('/')}
                        variant="contained"
                        fullWidth
                        sx={{
                            background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                            color: '#3E2C1E',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            padding: '14px 32px',
                            boxShadow: '0 10px 25px rgba(249, 178, 51, 0.3)',
                            '&:hover': { 
                                background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)', 
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 30px rgba(249, 178, 51, 0.4)'
                            }
                        }}
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen font-sans pb-20 bg-[#F5F1E8] selection:bg-[#F9B233] selection:text-[#3E2C1E] overflow-hidden relative'>

            {/* Decorative Warm Blobs */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#3E2C1E] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="fixed top-[40%] left-[50%] w-[400px] h-[400px] bg-[#FDF6E3] rounded-full mix-blend-multiply filter blur-[90px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

            <div className='max-w-[1400px] mx-auto pt-10 px-4 lg:px-10 relative z-10'>

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
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
                    <h1 className="text-4xl font-black text-[#3E2C1E] flex items-center gap-3 tracking-tight">
                        Shopping Cart
                        <span className="text-sm font-bold text-white bg-gradient-to-r from-[#F9B233] to-[#D97706] px-4 py-1.5 rounded-full shadow-lg">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </span>
                    </h1>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                    {/* --- LEFT COLUMN: CART ITEMS --- */}
                    <div className='lg:col-span-2 space-y-5'>
                        {cartItems.map((item: any) => (
                            <div 
                                key={item.id} 
                                className="bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_-10px_rgba(62,44,30,0.08)] rounded-[28px] p-6 flex gap-6 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(62,44,30,0.15)] hover:border-[#F9B233]/50 hover:-translate-y-1 group"
                            >

                                {/* Image Container */}
                                <div className="h-36 w-36 flex-shrink-0 bg-white/80 p-3 rounded-2xl border border-white/90 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-500">
                                    <img 
                                        src={item.product?.images?.[0] || ""} 
                                        alt={item.product?.title} 
                                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-extrabold text-[#3E2C1E] text-lg leading-tight line-clamp-2 group-hover:text-[#F9B233] transition-colors duration-300">
                                            {item.product?.title}
                                        </h3>
                                        <p className="text-sm text-[#8D5A46] mt-2 font-semibold">
                                            Size: <span className="text-[#3E2C1E] bg-[#F9B233]/10 px-2 py-0.5 rounded-lg">{item.size}</span>
                                        </p>

                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="font-black text-[#3E2C1E] text-2xl">₹{item.sellingPrice}</span>
                                            <span className="text-sm text-[#A1887F] line-through font-medium">₹{item.mrpPrice}</span>
                                            <span className="text-xs text-white font-black bg-gradient-to-r from-[#F9B233] to-[#D97706] px-3 py-1 rounded-full shadow-sm">
                                                {Math.round(((item.mrpPrice - item.sellingPrice) / item.mrpPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex justify-between items-center mt-5">
                                        <div className="flex items-center gap-4">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-white/90 rounded-full px-2 py-1.5 shadow-md">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{ 
                                                        width: 34, 
                                                        height: 34, 
                                                        color: '#3E2C1E', 
                                                        '&:disabled': { color: '#D7CCC8' },
                                                        '&:hover': { bgcolor: '#FFF8F0' }
                                                    }}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <span className="font-black w-10 text-center text-[#3E2C1E] text-lg">{item.quantity}</span>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                    sx={{ 
                                                        width: 34, 
                                                        height: 34, 
                                                        color: 'white', 
                                                        bgcolor: '#F9B233', 
                                                        boxShadow: '0 2px 8px rgba(249,178,51,0.3)', 
                                                        '&:hover': { 
                                                            bgcolor: '#D97706',
                                                            transform: 'scale(1.05)'
                                                        },
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleRemoveItem(item.id)}
                                            startIcon={<DeleteOutline />}
                                            sx={{
                                                color: '#A1887F',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                borderRadius: '12px',
                                                padding: '8px 16px',
                                                border: '1px solid transparent',
                                                '&:hover': { 
                                                    backgroundColor: '#FFF8F0', 
                                                    color: '#D32F2F',
                                                    border: '1px solid #FFCDD2'
                                                }
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- RIGHT COLUMN: PRICE DETAILS (Sticky) --- */}
                    <div className='lg:col-span-1'>
                        <div className="bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_20px_50px_-10px_rgba(62,44,30,0.1)] rounded-[32px] p-7 sticky top-24">
                            <h2 className="text-xl font-black text-[#3E2C1E] mb-6 pb-4 border-b-2 border-[#F9B233]/20">
                                Price Details
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#5D4037] font-semibold text-base">
                                    <span>Price ({totalItem} {totalItem === 1 ? 'item' : 'items'})</span>
                                    <span className="font-bold">₹{totalMrpPrice}</span>
                                </div>

                                <div className="flex justify-between text-[#5D4037] font-semibold text-base">
                                    <span>Discount</span>
                                    <span className="text-[#0C831F] font-bold">- ₹{discount}</span>
                                </div>

                                <div className="flex justify-between text-[#5D4037] font-semibold text-base">
                                    <span>Delivery Charges</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? <span className="text-[#0C831F]">FREE</span> : `₹${shipping}`}
                                    </span>
                                </div>

                                {/* Dashed Separator */}
                                <div className="border-t-2 border-dashed border-[#F9B233]/30 my-4"></div>

                                <div className="flex justify-between items-center bg-gradient-to-r from-[#FFF8F0] to-[#FFF8E1] rounded-2xl p-4 shadow-sm">
                                    <span className="text-xl font-black text-[#3E2C1E]">Total Amount</span>
                                    <span className="text-2xl font-black text-[#3E2C1E]">₹{finalTotal}</span>
                                </div>
                            </div>

                            {/* Savings Strip */}
                            {discount > 0 && (
                                <div className="bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E1] border border-[#0C831F]/20 rounded-2xl p-4 mb-6 text-[#0C831F] text-sm font-bold flex items-center gap-3 shadow-sm">
                                    <LocalOffer sx={{ color: '#F9B233', fontSize: 20 }} />
                                    <span>You will save ₹{discount} on this order! 🎉</span>
                                </div>
                            )}

                            <Button
                                onClick={() => {
                                    if (localStorage.getItem("jwt")) {
                                        navigate('/checkout');
                                    } else {
                                        setAuthModalOpen(true);
                                    }
                                }}
                                fullWidth
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                                    color: 'white',
                                    fontWeight: '900',
                                    padding: '16px',
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 10px 25px rgba(249, 178, 51, 0.3)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 15px 35px rgba(249, 178, 51, 0.4)'
                                    }
                                }}
                            >
                                Place Order
                            </Button>

                            <AuthModal open={authModalOpen} handleClose={() => setAuthModalOpen(false)} />

                            <div className="mt-6 text-xs text-[#8D5A46] text-center flex items-center justify-center gap-2 font-semibold bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/60">
                                <Shield sx={{ fontSize: 16, color: '#0C831F' }} />
                                <span>Safe & Secure Payments • 100% Authentic</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

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
            `}</style>
        </div>
    );
};

export default Cart;
