import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { verifyPayment } from '../../../State/Payment/paymentApi';
import { useAppDispatch } from '../../../State/hooks';
import { clearOrderState } from '../../../State/Order/orderSlice';

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'FAILED'>('LOADING');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get('razorpay_payment_id');
        const paymentLinkId = queryParams.get('razorpay_payment_link_id');

        if (paymentId && paymentLinkId) {
            verifyPayment(paymentId, paymentLinkId)
                .then(() => {
                    setStatus('SUCCESS');
                    dispatch(clearOrderState());
                })
                .catch((err) => {
                    console.error("Payment Verification Failed", err);
                    setStatus('FAILED');
                });
        } else {
            console.error("Missing payment params");
            setStatus('FAILED');
        }
    }, [location.search, dispatch]);

    // UI Components
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 selection:bg-[#F9B233] selection:text-[#3E2C1E]">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8D5A46] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 pointer-events-none"></div>

            <div className="relative bg-white p-10 rounded-[32px] border border-[#E0D8CC] shadow-xl text-center max-w-md w-full">

                {status === 'LOADING' && (
                    <div className="flex flex-col items-center">
                        <CircularProgress sx={{ color: '#D97706' }} size={60} />
                        <h2 className="mt-6 text-xl font-bold text-[#3E2C1E]">Verifying Payment...</h2>
                        <p className="text-[#8D5A46] mt-2">Please do not close this window.</p>
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#4CAF50]/20">
                            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#2E7D32' }} />
                        </div>
                        <h2 className="text-3xl font-black text-[#3E2C1E] mb-2">Order Placed!</h2>
                        <p className="text-[#5D4037] mb-8 font-medium">
                            Thank you for your purchase.<br />
                            Your order ID is <span className="font-bold text-[#D97706]">#{orderId}</span>
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <Button
                                onClick={() => navigate('/account/orders')}
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                                    color: '#3E2C1E',
                                    borderRadius: '16px',
                                    padding: '12px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.2)',
                                    '&:hover': { background: '#D97706' }
                                }}
                            >
                                View Order
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                sx={{
                                    color: '#8D5A46',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': { background: '#FFF8E1' }
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'FAILED' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-[#FFEBEE] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#D32F2F]/20">
                            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#C62828' }} />
                        </div>
                        <h2 className="text-3xl font-black text-[#3E2C1E] mb-2">Payment Failed</h2>
                        <p className="text-[#5D4037] mb-8 font-medium">
                            We couldn't process your payment.<br />
                            Please try again.
                        </p>
                        <Button
                            onClick={() => navigate('/checkout')}
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: '#D32F2F',
                                color: 'white',
                                borderRadius: '16px',
                                padding: '12px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 8px 20px rgba(211, 47, 47, 0.2)',
                                '&:hover': { bgcolor: '#B71C1C' }
                            }}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentSuccess;
