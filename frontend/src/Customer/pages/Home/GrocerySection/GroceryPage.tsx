import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchProducts } from '../../../../State/product/productThunks';
import { Typography, IconButton } from '@mui/material';
import {
    ArrowForwardIos as ArrowForwardIosIcon,
    ElectricMoped,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Send
} from '@mui/icons-material';

import GroceryCard from './GroceryCard';

// --- VISUAL ASSETS ---
const banners = [
    "https://img.freepik.com/premium-vector/100-pure-farm-milk-promotion-banner-with-fresh-dairy-splash-bottle_848676-7743.jpg",
    "https://i.pinimg.com/736x/d7/83/10/d78310dbad0cbd59242ebcdb23786fa4.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLLcJ_hosRtaH7jqQsLhGkVSlvrx6PfHubRg&s",
];

const groceryCategories = [
    { label: "Dairy", targetId: "section-dairy", image: "https://cdn.dribbble.com/userupload/21725903/file/original-9f55c5d0c8c2711429194a80f6f827ca.jpg?format=webp&resize=640x480&vertical=center" },
    { label: "Vegetables", targetId: "section-vegetables", image: "https://cdn.dribbble.com/userupload/15980699/file/original-4b1c16c8657f3519f690e1172f06d31a.png?format=webp&resize=640x480&vertical=center" },
    { label: "Fruits", targetId: "section-fruits", image: "https://cdn.dribbble.com/userupload/20271534/file/original-2e9973fb7746efffc9abed1a82776179.jpg?format=webp&resize=640x480&vertical=center" },
    { label: "Organic", targetId: "section-organic", image: "https://cdn.dribbble.com/userupload/14584754/file/original-c88a478ac44004d683e312db118165b1.png?format=webp&resize=640x480&vertical=center" },
    { label: "Pulses", targetId: "section-pulses", image: "https://media.istockphoto.com/id/659524906/photo/composition-with-variety-of-vegetarian-food-ingredients.jpg?s=612x612&w=0&k=20&c=AzFdpJXWAVArpzTxJxhUqCENYcYb2ozltPhYaYJAkFQ=" },
];

const GroceryPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { items: allGroceryProducts } = useAppSelector(state => state.products);

    const [searchTerm, setSearchTerm] = useState("");

    // Initialize loading state immediately based on navigation state to prevent flash
    const [isLoading, setIsLoading] = useState(() => {
        return location.state?.fromHome === true;
    });

    useEffect(() => {
        // Fetch ALL products to catch both "groceries" and "grocery" root categories
        // We will filter them client-side to ensure we only show grocery items
        dispatch(fetchProducts({ pageSize: 100 }));
    }, [dispatch]);

    // Smooth Loading Effect (Visual Only)
    // Show animation when coming from Home page (via Groceries Instant button)
    useEffect(() => {
        const fromHome = location.state?.fromHome === true;
        
        if (fromHome) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
                // Clear the state so it doesn't animate again on reload/back
                navigate(location.pathname, { replace: true, state: {} });
            }, 2200);
            return () => clearTimeout(timer);
        }
    }, [location.state, location.pathname, navigate]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
        }
    };

    // Helper to check if a product belongs to a category (checking nested levels)
    // Updated to use 'includes' for flexible matching (e.g. "grocery_dairy" ~ "dairy")
    const productInCategory = (product: any, catId: string) => {
        const pCat = product.category;
        if (!pCat) return false;

        const checkCat = (c: any): boolean => {
            if (!c) return false;
            // Check lookup (includes is safer than ===)
            if (c.categoryId?.toLowerCase().includes(catId.toLowerCase())) return true;
            if (c.name?.toLowerCase().includes(catId.toLowerCase())) return true;
            // Recursively check parent
            return checkCat(c.parentCategory);
        };

        return checkCat(pCat);
    };

    // Filter to ensure we only show items that are actually groceries (root category contains 'grocer')
    // AND match the search term if present
    const filteredProducts = (allGroceryProducts || []).filter((product: any) => {
        const isGrocery = productInCategory(product, 'grocer'); // matches 'groceries' or 'grocery'
        const matchesSearch = !searchTerm ||
            product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return isGrocery && matchesSearch;
    });

    return (
        // MAIN BACKGROUND
        <div className='relative min-h-screen bg-[#F1F8E9] overflow-hidden selection:bg-[#1B5E20] selection:text-white flex flex-col'>

            {/* --- FLASHY LOADING OVERLAY --- */}
            <div className={`
                fixed inset-0 z-[2000] bg-[#136934] flex flex-col items-center justify-center transition-opacity duration-700 ease-out
                ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}>
                <div className="absolute inset-0 opacity-20 animate-pulse-slow" style={{ backgroundImage: 'radial-gradient(#66BB6A 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                <div className="relative animate-scooter-slide">
                    <ElectricMoped sx={{ fontSize: { xs: 80, md: 130 }, color: '#FFB300' }} />
                    <div className="absolute top-12 -left-20 w-28 h-1.5 bg-white/40 rounded-full animate-speed-line"></div>
                </div>
                <Typography variant="h4" sx={{ color: '#fff', mt: 4, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase', fontSize: { xs: '1.5rem', md: '2.125rem' } }} className="animate-pulse">
                    Grocery <span style={{ color: '#FFB300' }}>Instant</span>
                </Typography>
            </div>

            {/* --- DECORATIVE BACKGROUND BLOBS --- */}
            <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C8E6C9] rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-40 animate-blob pointer-events-none"></div>
            <div className="fixed top-[30%] right-[-10%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#A5D6A7] rounded-full mix-blend-multiply filter blur-[50px] md:blur-[80px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

            {/* CONTENT CONTAINER */}
            <div className={`relative max-w-[1600px] mx-auto px-4 lg:px-10 py-6 space-y-12 transition-all duration-1000 flex-grow ${isLoading ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>

                {/* --- LOCAL SEARCH ENGINE & HERO --- */}
                {/* --- PREMIUM HERO SECTION --- */}
                {!searchTerm && (
                    <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] shadow-2xl mx-2 md:mx-0">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
                            <div className="space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-[#FFB300] text-[#1B5E20] px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase mb-2 animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    Live Store
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-[#F1F8E9] leading-tight tracking-tighter">
                                    Farm To <br/><span className="text-[#FFB300]">Table.</span>
                                </h1>
                                <p className="text-[#C8E6C9] text-base md:text-lg font-medium max-w-md mx-auto md:mx-0 leading-relaxed opacity-90">
                                    Experience the freshest produce directly from local farms to your kitchen with zero compromise on quality.
                                </p>
                                <div className="flex gap-4 justify-center md:justify-start pt-4">
                                    <button className="bg-white text-[#1B5E20] px-8 py-3 rounded-full font-black text-sm md:text-base hover:bg-[#FFB300] hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => scrollToSection('section-vegetables')}>
                                        Shop Fresh
                                    </button>
                                    <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-white/20 transition-all duration-300">
                                        View Offers
                                    </button>
                                </div>
                            </div>

                            {/* Hero Visual */}
                            <div className="relative flex justify-center items-center">
                                <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-[#FFB300] rounded-full blur-[80px] opacity-30 animate-pulse-slow"></div>
                                <div className="relative z-10 transform ">
                                    <img 
                                        src="https://cdn.dribbble.com/userupload/15980699/file/original-4b1c16c8657f3519f690e1172f06d31a.png?format=webp&resize=640x480&vertical=center" 
                                        alt="Fresh Vegetables" 
                                        className="w-full max-w-[280px] md:max-w-[400px] object-contain drop-shadow-2xl "
                                    />
                                    {/* Removed specific time badge */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- CONDITIONAL CONTENT RENDER --- */}
                {searchTerm ? (
                    // SEARCH RESULTS VIEW
                    <div className="min-h-[60vh]">
                        <div className="flex items-center gap-2 mb-6">
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                Results for "{searchTerm}"
                            </Typography>
                            <span className="text-[#136934] font-bold bg-[#C8E6C9] px-3 py-1 rounded-full text-xs md:text-sm">
                                {filteredProducts.length} items
                            </span>
                        </div>

                        {/* Responsive Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                            {filteredProducts.map((product: any) => (
                                <div key={product.id} className="transform transition-transform duration-300 hover:scale-[1.02]">
                                    <GroceryCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // DEFAULT HOME VIEW
                    <>
                        {/* 2. TOP CATEGORIES */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                                <div>
                                    <span className="text-[#FFB300] font-black tracking-[4px] text-xs uppercase block mb-2">Explore Aisle</span>
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1B5E20', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: '-1px', lineHeight: 1 }}>
                                        Fresh <span className="text-[#388E3C] italic">Categories</span>
                                    </Typography>
                                </div>
                                <div className="flex gap-2 text-[#136934] font-bold text-xs uppercase tracking-widest bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#C8E6C9] shadow-sm">
                                    Farm to Fork <span className="text-[#FFB300]">✦</span> 100% Organic
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {groceryCategories.map((cat, index) => (
                                    <div
                                        key={index}
                                        onClick={() => scrollToSection(cat.targetId)}
                                        className="relative h-[200px] rounded-[32px] overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
                                    >
                                        <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                                {cat.label}
                                            </Typography>
                                            <span className="text-[#FFB300] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mt-2">
                                                Explore
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. PROMOTIONAL BANNERS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {banners.map((imgUrl, index) => (
                                <div key={index} className="relative h-[180px] md:h-[220px] rounded-[32px] overflow-hidden cursor-pointer group shadow-xl hover:shadow-[#1B5E20]/20 transition-all duration-700 hover:-translate-y-2">
                                    <img src={imgUrl} alt="Offer Banner" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-6">
                                        <button className="bg-white text-[#1B5E20] px-6 py-2 rounded-full font-black text-sm tracking-tighter shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            SHOP NOW
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-[#FFB300] text-[#1B5E20] px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-lg">OFFER</div>
                                </div>
                            ))}
                        </div>



                        {/* 4. PRODUCT SECTIONS (Green Glass Theme) */}
                        <div className='space-y-10 pb-20'>
                            <GlassSection
                                id="section-dairy"
                                title="Dairy, Bread & Eggs"
                                products={(allGroceryProducts || []).filter((p: any) => productInCategory(p, "dairy"))}
                            />
                            <GlassSection
                                id="section-vegetables"
                                title="Fresh Vegetables & Fruits"
                                products={(allGroceryProducts || []).filter((p: any) => productInCategory(p, "vegetables"))}
                            />
                            <GlassSection
                                id="section-fruits"
                                title="Fresh Fruits"
                                products={(allGroceryProducts || []).filter((p: any) => productInCategory(p, "fruits"))}
                            />
                            <GlassSection
                                id="section-organic"
                                title="Organic Staples"
                                products={(allGroceryProducts || []).filter((p: any) => productInCategory(p, "organic"))}
                            />
                            <GlassSection
                                id="section-pulses"
                                title="Dals, Pulses & Grains"
                                products={(allGroceryProducts || []).filter((p: any) => productInCategory(p, "pulses"))}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* --- GROCERY FOOTER --- */}
            {!isLoading && <GroceryFooter />}

            {/* --- CSS for Animations --- */}
            <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          @keyframes scooter-slide {
              0% { transform: translateX(-100vw); opacity: 0; }
              20% { opacity: 1; }
              40% { transform: translateX(0); opacity: 1; } 
              70% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(100vw); opacity: 0; }
          }
          .animate-scooter-slide { animation: scooter-slide 2.2s ease-in-out forwards; }
          @keyframes speed-line {
              0% { transform: translateX(0); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateX(-150px); opacity: 0; }
          }
          .animate-speed-line { animation: speed-line 0.6s linear infinite; }
          .animate-pulse-slow { animation: pulse 3s infinite; }
          .animate-bounce-slow { animation: bounce 3s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
        </div>
    );
};

// --- HELPER: Glassmorphic Section Container (Green Tint) ---
const GlassSection = ({ id, title, products }: { id: string, title: string, products: any[] }) => {
    // If no products, we can show a placeholder or nothing.
    // For now, let's just render what we have.
    const displayItems = products;

    return (
        <div id={id} className="scroll-mt-32 relative">
            <div className='flex justify-between items-center mb-4 px-1'>
                <div className="relative">
                    {/* Responsive Heading Font Size */}
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                        {title}
                    </Typography>
                </div>
                <button className="flex items-center gap-1 text-[#136934] font-bold text-xs md:text-sm hover:underline transition-all">
                    View All <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
                </button>
            </div>

            <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[32px] md:rounded-[48px] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(27,94,32,0.1)] transition-all duration-500 group">

                {displayItems.length === 0 ? (
                    <div className="text-center py-4 text-[#1B5E20] opacity-60 text-sm">
                        Loading items... (or no stock)
                    </div>
                ) : (
                    <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar py-2">
                        {displayItems.map((item: any, idx: number) => (
                            <div key={idx} className="min-w-[160px] md:min-w-[200px] transform transition-transform duration-300 hover:scale-[1.02]">
                                <GroceryCard product={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: GREEN GROCERY FOOTER (RESPONSIVE) ---
const GroceryFooter = () => {
    const navigate = useNavigate();

    const handleSupportClick = (item: string) => {
        if (item === "Partner with us") {
            navigate('/become-seller');
        }
    };

    return (
        <footer className="bg-[#1B5E20] text-white pt-8 md:pt-12 pb-6 border-t-4 border-[#FFB300] relative z-10 mt-8 md:mt-12">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10">
                {/* Grid Stack for Mobile (1 col) -> Tablet (2 cols) -> Desktop (4 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10 border-b border-[#2E7D32] pb-8 md:pb-10">

                    {/* Brand */}
                    <div className="space-y-3">
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            Grocery <span style={{ color: '#FFB300' }}>Instant</span>
                        </Typography>
                        <p className="text-[#C8E6C9] text-sm">Farm-fresh produce delivered in 8 minutes.</p>
                        <div className="flex gap-1">
                            {[<Facebook key="fb" />, <Twitter key="tw" />, <Instagram key="ig" />, <LinkedIn key="li" />].map((icon, i) => (
                                <IconButton key={i} sx={{ color: '#FFB300', '&:hover': { color: 'white' } }}>{icon}</IconButton>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-[#FFB300] font-bold mb-4">Categories</h3>
                        <ul className="space-y-2 text-[#C8E6C9] text-sm">
                            {["Fruits & Vegetables", "Dairy & Bakery", "Staples", "Snacks"].map(i => <li key={i} className="hover:text-white cursor-pointer transition-colors">{i}</li>)}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-[#FFB300] font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-[#C8E6C9] text-sm">
                            {["Partner with us", "Terms & Conditions", "Privacy Policy", "FAQ"].map(i => (
                                <li
                                    key={i}
                                    onClick={() => handleSupportClick(i)}
                                    className={`cursor-pointer transition-colors ${i === "Partner with us" ? "text-[#FFB300] font-semibold hover:text-white hover:underline" : "hover:text-white"}`}
                                >
                                    {i}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-[#FFB300] font-bold">Stay Fresh</h3>
                        <div className="flex bg-[#2E7D32] p-1 rounded-lg w-full">
                            <input type="email" placeholder="Email" className="bg-transparent text-white px-3 w-full outline-none placeholder-[#81C784] text-sm" />
                            <button className="bg-[#FFB300] text-[#1B5E20] rounded px-3 py-1 hover:bg-white transition-colors">
                                <Send fontSize="small" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[#81C784] text-xs">© 2026 GSPL Grocery Instant. Green & Fresh.</p>
            </div>
        </footer>
    );
};

export default GroceryPage;