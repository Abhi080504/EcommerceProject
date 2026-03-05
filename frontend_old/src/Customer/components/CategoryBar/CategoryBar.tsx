import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import Icons
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import FaceIcon from '@mui/icons-material/Face';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

// --- 1. Define Types ---
interface SubCategoryGroup {
    heading: string;
    items: string[];
}

interface CategoryItem {
    label: string;
    icon: React.ReactElement;
    path: string;
    megaMenu?: SubCategoryGroup[];
}

const CATEGORY_QUERY_MAP: Record<string, string> = {
    Men: "men",
    Women: "women",
    Electronics: "electronics",
    Fashion: "fashion",
    Home: "home",
    Beauty: "beauty",
    Minutes: "grocery",
};


// --- 2. Data Definition ---
const categoryData: CategoryItem[] = [
    { label: 'Minutes', icon: <ElectricBikeIcon />, path: '/grocery' },
    { label: 'All', icon: <ShoppingCartIcon />, path: '/all' },
    {
        label: 'Home',
        icon: <HomeIcon />,
        path: '/home-living',
        megaMenu: [
            { heading: "Decor", items: ["Wall Art", "Clocks", "Mirrors", "Photo Frames"] },
            { heading: "Kitchen", items: ["Cookware", "Storage", "Tableware", "Bakeware"] },
            { heading: "Bedding", items: ["Bedsheets", "Comforters", "Pillows", "Blankets"] },
            { heading: "Lighting", items: ["Lamps", "Floor Lamps", "String Lights", "Bulbs"] }
        ]
    },
    { label: 'Men', icon: <ManIcon />, path: '/men' },
    { label: 'Women', icon: <WomanIcon />, path: '/women' },
    {
        label: 'Electronics',
        icon: <DevicesIcon />,
        path: '/electronics',
        megaMenu: [
            { heading: "Audio", items: ["Headphones", "Speakers", "Earbuds", "Soundbars"] },
            { heading: "Cameras", items: ["DSLR", "Action Cameras", "Drones", "Accessories"] },
            { heading: "Gaming", items: ["Consoles", "Controllers", "Video Games", "PC Gaming"] },
            { heading: "Smart Home", items: ["Assistants", "Security Cameras", "Smart Plugs"] }
        ]
    },
    {
        label: 'Fashion',
        icon: <CheckroomIcon />,
        path: '/fashion',
        megaMenu: [
            { heading: "Men's Wear", items: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Jeans", "Trousers"] },
            { heading: "Women's Wear", items: ["Kurtas & Suits", "Sarees", "Ethnic Wear", "Dresses", "Tops"] },
            { heading: "Footwear", items: ["Casual Shoes", "Sports Shoes", "Formal Shoes", "Heels", "Boots"] },
            { heading: "Accessories", items: ["Watches", "Belts", "Wallets", "Jewellery", "Sunglasses"] }
        ]
    },
    { label: 'Beauty', icon: <FaceIcon />, path: '/beauty' },
];

const CategoryBar = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        // THEME UPDATE: Compact Size + Orange Glassmorphism
        <Box sx={{
            // Using RGBA for the gradient allows the blur to work (Glassmorphism)
            background: 'linear-gradient(135deg, rgba(249, 178, 51, 0.85) 0%, rgba(217, 119, 6, 0.85) 100%)',
            backdropFilter: 'blur(10px)', // The glass blur effect
            py: 1, // Reduced padding (was py-2)
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
            <div className="max-w-[1600px] mx-auto px-4 lg:px-10 relative">

                <div className="flex justify-between items-center gap-2 overflow-x-auto lg:overflow-visible no-scrollbar">

                    {categoryData.map((item, index) => {
                        const isActive = activeCategory === item.label;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    const categoryQuery = CATEGORY_QUERY_MAP[item.label];

                                    if (categoryQuery) {
                                        navigate(`/products?category=${categoryQuery}`);
                                    } else if (item.label === "All") {
                                        navigate("/products");
                                    } else {
                                        navigate(item.path);
                                    }
                                }}

                                onMouseEnter={() => setActiveCategory(item.label)}
                                onMouseLeave={() => setActiveCategory(null)}
                                // Reduced min-width and gap for a compact look
                                className="flex flex-col items-center gap-1 min-w-[50px] md:min-w-[60px] cursor-pointer group pb-1"
                            >
                                {/* Icon Circle */}
                                <div className={`
                                w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-[10px] 
                                transition-all duration-300 group-hover:scale-105 shadow-sm
                                ${item.label === 'All'
                                        ? 'bg-[#3E2C1E] text-[#F9B233]' // Dark Highlight
                                        : 'bg-[#FDF6E3] text-[#3E2C1E] group-hover:bg-[#3E2C1E] group-hover:text-[#F9B233]'} 
                            `}>
                                    {/* ERROR FIX: Casting as 'any' to cloneElement or just letting parent control size */}
                                    {React.cloneElement(item.icon as any, {
                                        sx: { fontSize: { xs: '18px', md: '20px' } } // Explicit size via SX
                                    })}
                                </div>

                                {/* Label */}
                                <Typography sx={{
                                    fontSize: '10px', // Smaller font
                                    fontWeight: item.label === 'All' ? 900 : 600,
                                    color: '#3E2C1E',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s',
                                    letterSpacing: '0.3px'
                                }}>
                                    {item.label}
                                </Typography>

                                {/* --- MEGA MENU DROPDOWN --- */}
                                {item.megaMenu && isActive && (
                                    <div className="absolute top-full left-0 w-full pt-2 cursor-default hidden lg:block z-50">
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                bgcolor: 'rgba(253, 246, 227, 0.95)', // Glassy Cream
                                                backdropFilter: 'blur(15px)',
                                                border: '1px solid #F9B233',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                width: '100%',
                                                maxWidth: '100%',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, 1fr)',
                                                gap: 3,
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {item.megaMenu.map((group, idx) => (
                                                <div key={idx} className="flex flex-col gap-2">
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: '800',
                                                        color: '#D97706',
                                                        textTransform: 'uppercase',
                                                        fontSize: '11px',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {group.heading}
                                                    </Typography>

                                                    <div className="flex flex-col gap-1">
                                                        {group.items.map((subItem, subIdx) => (
                                                            <Typography
                                                                key={subIdx}
                                                                variant="body2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const slug = subItem.toLowerCase().replace(/ /g, "_");
                                                                    navigate(`/products?category=${slug}`);
                                                                }}
                                                                sx={{
                                                                    color: '#3E2C1E',
                                                                    fontSize: '12px',
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        color: '#D97706',
                                                                        fontWeight: '600',
                                                                        transform: 'translateX(2px)'
                                                                    },
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                {subItem}
                                                            </Typography>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </Paper>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* Hide Scrollbar CSS */}
            <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        </Box>
    )
}

export default CategoryBar;