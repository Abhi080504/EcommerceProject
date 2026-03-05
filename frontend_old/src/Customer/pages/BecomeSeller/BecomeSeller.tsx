import React, { useEffect, useState } from 'react';
import SellerAccountForm from './SellerAccountForm';
import SellerLoginForm from './SellerLoginForm';
import { TrendingUp, EmojiEvents, Storefront } from '@mui/icons-material';
import { useAppSelector } from '../../../State/hooks';
import { useNavigate } from 'react-router-dom';

const BecomeSeller = () => {
    const [isLogin, setIsLogin] = useState(false);
    const { seller, user, jwt } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirection should only happen if we are SURE the user is a seller
        const isSellerUser = user?.role === "ROLE_SELLER";
        const hasSellerProfile = !!seller;

        if (isSellerUser || hasSellerProfile) {
            navigate("/seller", { replace: true });
        }
    }, [seller, user, navigate]);

    // PREVENT RENDER: Only if we are already confident the user is a seller
    if (user?.role === "ROLE_SELLER" || seller) {
        return (
            <div className='min-h-screen bg-[#FDFBF7] flex items-center justify-center'>
                <p className="text-[#8D5A46] font-bold animate-pulse">Entering Dashboard...</p>
            </div>
        );
    }

    return (
        // 1. PAGE BACKGROUND: Clean White/Warm White
        <div className='min-h-screen bg-[#FDFBF7] font-sans overflow-x-hidden text-[#3E2C1E]'>

            {/* --- HERO SECTION --- */}
            <div className='relative w-full pt-16 pb-24 px-4 lg:px-10 overflow-hidden'>

                {/* 2. SUBTLE BACKGROUND DECORATION (Golden/Brown Blobs) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    {/* Golden Blob */}
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob"></div>
                    {/* Brown Blob */}
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8D5A46] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
                </div>

                <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10'>

                    {/* LEFT: TEXT & PITCH */}
                    <div className='space-y-8'>
                        {/* Tagline Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#F9B233]/30 rounded-full shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#F9B233] animate-pulse"></span>
                            <span className="text-[#8D5A46] text-xs font-bold tracking-widest uppercase">
                                Sell Online. Get Paid Weekly.
                            </span>
                        </div>

                        {/* Main Heading: Dark Brown with Golden Accent */}
                        <h1 className='text-5xl lg:text-7xl font-black leading-tight tracking-tight'>
                            Grow with <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#F9B233]'>
                                GSPL Mart
                            </span>
                        </h1>

                        <p className='text-lg text-[#5D4037] max-w-md leading-relaxed'>
                            Join the hyperlocal revolution. <strong className="text-[#3E2C1E]">0% Commission</strong> for the first 30 days. Simple registration, massive reach.
                        </p>

                        {/* Stats Row (Clean White Cards) */}
                        <div className='flex flex-wrap gap-4 pt-4'>
                            <StatCard value="10L+" label="Daily Orders" />
                            <StatCard value="100+" label="Cities Live" />
                            <StatCard value="7 Day" label="Payments" />
                        </div>
                    </div>

                    {/* RIGHT: FLOATING FORM CONTAINER */}
                    <div className='relative group'>
                        {/* Subtle Shadow/Glow behind form */}
                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#F9B233] to-[#8D5A46] rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                        {/* Glass/White Card */}
                        <div className='relative bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(62,44,30,0.1)] rounded-3xl p-6 lg:p-8 overflow-hidden'>

                            {/* Form Header */}
                            <div className='flex justify-between items-center mb-8'>
                                <div>
                                    <h2 className='text-2xl font-bold text-[#3E2C1E]'>
                                        {isLogin ? "Welcome Back" : "Start Selling"}
                                    </h2>
                                    <p className="text-sm text-[#8D5A46] mt-1">
                                        {isLogin ? "Login to manage store" : "Create account in 10 mins"}
                                    </p>
                                </div>

                                {/* Toggle Switch: Brown & Gold */}
                                <div className="bg-[#F5F1E8] p-1 rounded-xl flex text-xs font-bold border border-[#E0D8CC]">
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${!isLogin ? 'bg-[#3E2C1E] text-white shadow-md' : 'text-[#8D5A46] hover:text-[#3E2C1E]'}`}
                                    >
                                        Register
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${isLogin ? 'bg-[#3E2C1E] text-white shadow-md' : 'text-[#8D5A46] hover:text-[#3E2C1E]'}`}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>

                            {/* Form Render Area */}
                            <div className="bg-[#FDFBF7] rounded-2xl p-1 border border-[#F5F1E8]">
                                {isLogin ? <SellerLoginForm /> : <SellerAccountForm />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BENEFITS SECTION --- */}
            <div className='max-w-6xl mx-auto px-4 py-16 relative z-20'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <GlassBenefitCard
                        icon={<TrendingUp fontSize="large" />}
                        title="3X Growth"
                        desc="Sellers see an average of 3x growth in the first 3 months."
                    />
                    <GlassBenefitCard
                        icon={<EmojiEvents fontSize="large" />}
                        title="0% Commission"
                        desc="Keep 100% of your profit for the first 30 days."
                    />
                    <GlassBenefitCard
                        icon={<Storefront fontSize="large" />}
                        title="Store Support"
                        desc="Dedicated manager to help you list products."
                    />
                </div>
            </div>

            {/* CSS Animation Styles */}
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
    )
}

// Sub-Component: Hero Stats (Clean White with Brown Text)
const StatCard = ({ value, label }: { value: string, label: string }) => (
    <div className='bg-white border border-[#E0D8CC] px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:border-[#F9B233] transition-all cursor-default'>
        <h3 className='font-extrabold text-2xl text-[#3E2C1E]'>{value}</h3>
        <p className='text-xs text-[#8D5A46] font-bold uppercase tracking-wide'>{label}</p>
    </div>
)

// Sub-Component: Benefit Cards (White cards with Golden Icons)
const GlassBenefitCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className='bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(62,44,30,0.05)] border border-transparent hover:border-[#F9B233]/30 hover:-translate-y-2 transition-all duration-300 group'>
        <div className='w-16 h-16 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#F9B233] mb-6 group-hover:bg-[#F9B233] group-hover:text-white transition-colors duration-300 shadow-inner'>
            {icon}
        </div>
        <h3 className='font-bold text-[#3E2C1E] text-xl mb-3'>{title}</h3>
        <p className='text-[#5D4037] leading-relaxed text-sm'>{desc}</p>
    </div>
)

export default BecomeSeller;
