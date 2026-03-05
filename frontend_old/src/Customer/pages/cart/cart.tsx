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
        // Ideally, we refetch cart to get updated prices
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
    // Shipping logic (Example: Free > 500)
    const shipping = totalSellingPrice > 500 ? 0 : 50;
    const finalTotal = totalSellingPrice + shipping;


    // --- EMPTY CART VIEW ---
    if (!loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 selection:bg-[#F9B233] selection:text-[#3E2C1E]">
                {/* Background Blobs */}
                <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob pointer-events-none"></div>
                <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8D5A46] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="relative bg-white/80 backdrop-blur-xl p-12 rounded-[32px] border border-[#E0D8CC] shadow-xl text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#F9B233]/20">
                        <ShoppingBag sx={{ fontSize: 48, color: '#D97706' }} />
                    </div>
                    <h2 className="text-2xl font-black text-[#3E2C1E] mb-2">Your Cart is Empty</h2>
                    <p className="text-[#8D5A46] mb-8 font-medium">Looks like you haven't made your choice yet.</p>
                    <Button
                        onClick={() => navigate('/')}
                        variant="contained"
                        fullWidth
                        sx={{
                            background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                            color: '#3E2C1E',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '1rem',
                            padding: '12px 30px',
                            boxShadow: '0 8px 20px rgba(217, 119, 6, 0.2)',
                            '&:hover': { background: '#D97706', color: 'white', transform: 'translateY(-2px)' }
                        }}
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        // MAIN BACKGROUND: Warm White / Cream
        <div className='min-h-screen font-sans pb-20 bg-[#FDFBF7] selection:bg-[#F9B233] selection:text-[#3E2C1E] overflow-hidden relative'>

            {/* Decorative Warm Blobs */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#8D5A46] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className='max-w-[1400px] mx-auto pt-10 px-4 lg:px-10 relative z-10'>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <IconButton onClick={() => navigate(-1)} sx={{ color: '#5D4037', bgcolor: 'white', border: '1px solid #E0D8CC', '&:hover': { bgcolor: '#F9B233', color: '#3E2C1E', border: '1px solid #F9B233' } }}>
                        <ArrowBack />
                    </IconButton>
                    <h1 className="text-3xl font-black text-[#3E2C1E] flex items-center gap-3">
                        Shopping Cart
                        <span className="text-sm font-bold text-[#D97706] bg-[#FFF8F0] px-3 py-1 rounded-full shadow-sm border border-[#F9B233]/30">
                            {cartItems.length} items
                        </span>
                    </h1>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                    {/* --- LEFT COLUMN: CART ITEMS --- */}
                    <div className='lg:col-span-2 space-y-6'>
                        {cartItems.map((item: any) => (
                            // WHITE CARD with Warm Border
                            <div key={item.id} className="bg-white border border-[#E0D8CC] shadow-sm rounded-[24px] p-5 flex gap-5 transition-all hover:shadow-[0_8px_30px_rgba(62,44,30,0.08)] hover:border-[#F9B233]/50 group">

                                {/* Image Container */}
                                <div className="h-32 w-32 flex-shrink-0 bg-[#F9F9F9] p-2 rounded-2xl border border-[#F0EAE0] flex items-center justify-center">
                                    <img src={item.product?.images?.[0] || ""} alt={item.product?.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-[#3E2C1E] text-lg leading-tight line-clamp-2 group-hover:text-[#D97706] transition-colors">{item.product?.title}</h3>
                                        <p className="text-sm text-[#8D5A46] mt-1 font-medium">Size: <span className="text-[#5D4037]">{item.size}</span></p>

                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="font-black text-[#3E2C1E] text-xl">₹{item.sellingPrice}</span>
                                            <span className="text-sm text-[#A1887F] line-through font-medium">₹{item.mrpPrice}</span>
                                            {/* Calculated discount for item level might not be available directly, using placeholder logic */}
                                            <span className="text-xs text-[#3E2C1E] font-bold bg-[#F9B233] px-2 py-1 rounded-lg">Off</span>
                                        </div>
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-4">
                                            {/* Quantity Stepper (Brown Theme) */}
                                            <div className="flex items-center bg-[#FDFBF7] border border-[#E0D8CC] rounded-full px-1 py-1 shadow-sm">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{ width: 32, height: 32, color: '#5D4037', '&:disabled': { color: '#D7CCC8' } }}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <span className="font-bold w-8 text-center text-[#3E2C1E]">{item.quantity}</span>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                    sx={{ width: 32, height: 32, color: '#3E2C1E', bgcolor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#F9B233' } }}
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
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                borderRadius: '8px',
                                                padding: '6px 12px',
                                                '&:hover': { backgroundColor: '#FFF8F0', color: '#D32F2F' }
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
                        <div className="bg-white border border-[#E0D8CC] shadow-[0_10px_40px_-10px_rgba(62,44,30,0.08)] rounded-[28px] p-6 sticky top-24">
                            <h2 className="text-lg font-black text-[#3E2C1E] mb-5 border-b border-[#F5F1E8] pb-4">Price Details</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#5D4037] font-medium">
                                    <span>Price ({totalItem} items)</span>
                                    <span>₹{totalMrpPrice}</span>
                                </div>

                                <div className="flex justify-between text-[#5D4037] font-medium">
                                    <span>Discount</span>
                                    <span className="text-[#D97706]">- ₹{discount}</span>
                                </div>

                                <div className="flex justify-between text-[#5D4037] font-medium">
                                    <span>Delivery Charges</span>
                                    <span>{shipping === 0 ? <span className="text-[#D97706]">Free</span> : `₹${shipping}`}</span>
                                </div>

                                {/* Dashed Separator */}
                                <div className="border-t border-dashed border-[#D7CCC8] my-2"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-[#3E2C1E]">Total Amount</span>
                                    <span className="text-xl font-black text-[#3E2C1E]">₹{finalTotal}</span>
                                </div>
                            </div>

                            {/* Savings Strip */}
                            <div className="bg-[#FFF8E1] border border-[#F9B233]/30 rounded-xl p-3 mb-6 text-[#D97706] text-sm font-bold flex items-center gap-2">
                                <LocalOffer fontSize="small" sx={{ color: '#F9B233' }} />
                                You will save ₹{discount} on this order
                            </div>

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
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)', // Gold Gradient
                                    color: '#3E2C1E', // Dark Text
                                    fontWeight: '900',
                                    padding: '14px',
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.25)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 10px 25px rgba(217, 119, 6, 0.35)'
                                    }
                                }}
                            >
                                Place Order
                            </Button>

                            <AuthModal open={authModalOpen} handleClose={() => setAuthModalOpen(false)} />

                            <div className="mt-6 text-xs text-[#A1887F] text-center flex items-center justify-center gap-2 font-medium">
                                <Shield fontSize="small" />
                                <span>Safe and Secure Payments. 100% Authentic products.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CSS for Blobs */}
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
      `}</style>
        </div>
    );
};

export default Cart;