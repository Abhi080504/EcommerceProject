import React from 'react';
import CategoryGrid from './CategoryGrid/CategoryGrid';
import CategoryProductSection from './CategoryProductSection';
import CategoryBar from '../../components/CategoryBar/CategoryBar';

import { Typography } from '@mui/material';

const Home = () => {
    return (
        // MAIN BACKGROUND: Warm Cream/Beige with Yellow Selection
        <div className='relative min-h-screen bg-[#F5F1E8] overflow-hidden selection:bg-[#F9B233] selection:text-[#3E2C1E]'>

            {/* --- DECORATIVE BACKGROUND BLOBS (Liquid Effect - Warm Yellow & Dark Brown Theme) --- */}
            {/* Blob 1: Deep Dark Brown (Contrast Color) */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3E2C1E] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>

            {/* Blob 2: Vibrant Yellow/Gold (Primary Accent) */}
            <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

            {/* Blob 3: Lighter Cream/Yellow Tint (Support Color) */}
            <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#FDF6E3] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

            {/* --- Category Bar Section --- */}
            <div className="relative z-20">
                <CategoryBar />
            </div>

            {/* CONTENT CONTAINER */}
            <div className='relative max-w-[1600px] mx-auto px-4 lg:px-10 py-8 space-y-12 z-10'>

                {/* 1. LARGE HERO BANNERS (Glass + Hover Effects) */}
                <div className='flex flex-col md:flex-row gap-6 w-full'>

                    {/* Banner 1: Yellow Theme Accent */}
                    <div className='w-full md:w-1/2 relative group cursor-pointer'>
                        {/* Glow changed to Yellow Accent */}
                        <div className="absolute inset-0 bg-[#F9B233] blur-[20px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-[32px] translate-y-4"></div>
                        <div className="relative h-[250px] md:h-[320px] rounded-[32px] overflow-hidden border border-white/60 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                            <img
                                src="https://pimwp.s3-accelerate.amazonaws.com/2025/01/Untitled-design-3.jpg"
                                alt="Banner 1"
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                            />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        </div>
                    </div>

                    {/* Banner 2: Dark Brown Theme Accent */}
                    <div className='w-full md:w-1/2 relative group cursor-pointer'>
                        {/* Glow changed to Dark Brown */}
                        <div className="absolute inset-0 bg-[#3E2C1E] blur-[20px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[32px] translate-y-4"></div>
                        <div className="relative h-[250px] md:h-[320px] rounded-[32px] overflow-hidden border border-white/60 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                            <img
                                src="https://images.indianexpress.com/2018/07/2_759-8.jpg"
                                alt="Banner 2"
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        </div>
                    </div>

                </div>

                {/* 2. CATEGORY GRID SECTION (Glass Panel) */}
                <div className='space-y-6'>
                    <div className="flex items-center gap-3 px-2">
                        {/* Accent Bar: Yellow */}
                        <span className="w-1.5 h-8 bg-[#F9B233] rounded-full"></span>
                        {/* Text: Dark Brown */}
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#3E2C1E', letterSpacing: '-0.5px' }}>
                            Shop by Category
                        </Typography>
                    </div>

                    {/* Glass Container for Grid - Warm shadow tint */}
                    <div className="
                    bg-white/40 backdrop-blur-md border border-white/60 rounded-[40px] p-6 md:p-10
                    shadow-[0_8px_32px_0_rgba(62,44,30,0.05)]
                ">
                        <CategoryGrid />
                    </div>
                </div>



                {/* 3. PRODUCT SHELVES (Floating Sections) */}
                <div className='space-y-12 pb-24'>
                    <GlassCategorySection tagName="New Arrivals" />
                    <GlassCategorySection categoryName="men_kurta" tagName="Men's Kurta" />
                    <GlassCategorySection categoryName="women_sarees" tagName="Saree" />
                    <GlassCategorySection categoryName="men_jeans" tagName="Men's Jeans" />
                    <GlassCategorySection categoryName="women_dress" tagName="Women's Dresses" />
                    <GlassCategorySection categoryName="women_jeans" tagName="Women's Jeans" />
                    <GlassCategorySection categoryName="lengha_choli" tagName="Lengha Choli" />
                </div>

            </div>

            {/* Inline Styles for Animation */}
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
    )
}

// --- HELPER: Glass Container for Product Shelves ---
const GlassCategorySection = ({ categoryName, tagName }: { categoryName?: string, tagName: string }) => (
    <div className="relative group">
        {/* Glass Background with Warm/White Tint */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-[32px] -z-10 border border-white/70 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="p-6 md:p-8">
            <CategoryProductSection categoryName={categoryName} tagName={tagName} />
        </div>
    </div>
);

export default Home;