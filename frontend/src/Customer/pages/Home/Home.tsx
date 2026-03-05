import React, { useEffect } from 'react';
import CategoryGrid from './CategoryGrid/CategoryGrid';
import CategoryProductSection from './CategoryProductSection';
import CategoryBar from '../../components/CategoryBar/CategoryBar';
import DealSection from './Deals/DealSection';
import { Typography } from '@mui/material';

// --- HELPER: Glass Container for Product Shelves (Optimized) ---
const GlassCategorySection = ({ categoryName, tagName, id }: { categoryName?: string, tagName: string, id: string }) => (
    <div id={id} className="relative group min-h-[300px]">
        {/* Simplified Glass Background */}
        <div className="absolute inset-0 bg-white/40 rounded-[32px] -z-10 border border-white/60 shadow-sm transition-opacity duration-300">
        </div>
        <div className="p-6 md:p-8">
            <CategoryProductSection id={id} categoryName={categoryName} tagName={tagName} />
        </div>
    </div>
);

const Home = () => {
    // ---------- SCROLL RESTORATION LOGIC ----------
    useEffect(() => {
        const lastSectionId = sessionStorage.getItem('last_home_section');
        if (lastSectionId) {
            // Precise scroll restoration: wait and then jump
            const timer = setTimeout(() => {
                const element = document.getElementById(lastSectionId);
                if (element) {
                    const yOffset = -120; // Header offset + some padding
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    
                    // Clear it after restoration to avoid jumps on refresh
                    sessionStorage.removeItem('last_home_section');
                }
            }, 500); // 500ms allows initial paint
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        // MAIN BACKGROUND: Warm Cream/Beige with Yellow Selection
        <div className='relative min-h-screen bg-[#F5F1E8] overflow-hidden selection:bg-[#F9B233] selection:text-[#3E2C1E]'>

            {/* --- SIMPLIFIED DECORATIVE BACKGROUND (Single Static Blob) --- */}
            <div className="fixed top-[10%] right-[5%] w-[600px] h-[600px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 pointer-events-none"></div>

            {/* --- Category Bar Section --- */}
            <div className="relative z-20">
                <CategoryBar />
            </div>

            {/* CONTENT CONTAINER */}
            <div className='relative max-w-[1600px] mx-auto px-4 lg:px-10 py-8 space-y-12 z-10'>

                {/* 1. LARGE HERO BANNERS (Glass + Hover Effects) */}
                <div id="hero-banners" className='flex flex-col md:flex-row gap-6 w-full'>

                    {/* Banner 1: Yellow Theme Accent */}
                <div className='w-full md:w-1/2 relative group cursor-pointer'>
                    {/* Simplified Glow */}
                    <div className="absolute inset-0 bg-[#F9B233] blur-[15px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-[32px] translate-y-4"></div>
                    <div className="relative h-[250px] md:h-[320px] rounded-[32px] overflow-hidden border border-white/60 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                        <img
                            src="https://pimwp.s3-accelerate.amazonaws.com/2025/01/Untitled-design-3.jpg"
                            alt="Banner 1"
                            loading="lazy"
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                    </div>
                </div>

                    {/* Banner 2: Dark Brown Theme Accent */}
                <div className='w-full md:w-1/2 relative group cursor-pointer'>
                    {/* Simplified Glow */}
                    <div className="absolute inset-0 bg-[#3E2C1E] blur-[15px] opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-[32px] translate-y-4"></div>
                    <div className="relative h-[250px] md:h-[320px] rounded-[32px] overflow-hidden border border-white/60 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                        <img
                            src="https://images.indianexpress.com/2018/07/2_759-8.jpg"
                            alt="Banner 2"
                            loading="lazy"
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                    </div>
                </div>

                </div>

                {/* 2. CATEGORY GRID SECTION (Glass Panel) */}
                <div id="category-grid" className='space-y-6 min-h-[200px]'>
                    {/* Optimized Glass Container */}
                    <div className="
                        bg-white/30 rounded-[40px] p-6 md:p-10
                        shadow-[0_4px_20px_0_rgba(62,44,30,0.04)]
                    ">
                        {/* Header Inside Container */}
                        <div className="flex items-center gap-3 px-2 mb-8 pb-4 border-b border-[#3E2C1E]/5">
                            {/* Accent Bar: Yellow */}
                            <span className="w-1.5 h-8 bg-[#F9B233] rounded-full"></span>
                            {/* Text: Dark Brown */}
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#3E2C1E', letterSpacing: '-0.5px' }}>
                                Shop By Category
                            </Typography>
                        </div>
                        <CategoryGrid />
                    </div>
                </div>

                {/* 3. HOT DEALS SECTION */}
                <div id="deal-section">
                    <DealSection />
                </div>

                {/* 3. PRODUCT SHELVES (Floating Sections) */}
                <div className='space-y-12 pb-24'>
                    <GlassCategorySection id="section-new-arrivals" tagName="New Arrivals" />
                    <GlassCategorySection id="section-men-s-kurta" categoryName="men_kurta" tagName="Men's Kurta" />
                    <GlassCategorySection id="section-saree" categoryName="women_sarees" tagName="Saree" />
                    <GlassCategorySection id="section-men-s-jeans" categoryName="men_jeans" tagName="Men's Jeans" />
                    <GlassCategorySection id="section-women-s-dresses" categoryName="women_dress" tagName="Women's Dresses" />
                    <GlassCategorySection id="section-women-s-jeans" categoryName="women_jeans" tagName="Women's Jeans" />
                    <GlassCategorySection id="section-lengha-choli" categoryName="lengha_choli" tagName="Lengha Choli" />
                </div>

            </div>

            {/* Simplified Animation Styles */}
            <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(20px, -30px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 10s infinite;
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

export default Home;
