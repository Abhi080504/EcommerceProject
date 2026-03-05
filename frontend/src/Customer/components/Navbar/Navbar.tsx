import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Button, IconButton, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import HomeIcon from '@mui/icons-material/Home';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from '../Auth/AuthModal';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { fetchUserCart } from '../../../State/Cart/cartThunks';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const dispatch = useAppDispatch();
    const { cart } = useAppSelector(state => state.cart);
    const { user } = useAppSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            navigate(`/products?query=${searchQuery}`);
        }
    }, [searchQuery, navigate]);



    // Fetch cart only once when user logs in
    useEffect(() => {
        if (user) {
            dispatch(fetchUserCart());
        }
    }, [dispatch, user?.id]);

    // Check if we are currently on the grocery page
    const isGroceryPage = location.pathname === '/grocery';

    // --- THEME CONFIGURATION (Memoized for performance) ---
    const theme = useMemo(() => isGroceryPage ? {
        // GROCERY THEME (Green)
        bg: 'rgba(19, 105, 52, 0.95)',
        text: '#FFFFFF',
        accent: '#FFB300',
        searchBg: '#FFFFFF',
        searchPlaceholder: 'rgba(255, 255, 255, 0.7)',
        searchText: '#136934',
        iconColor: '#fff',
        cartBg: '#FFB300',
        cartText: '#136934',
        logoText: '#FFFFFF',
        logoAccent: '#FFB300'
    } : {
        // HOME THEME (Warm Cream)
        bg: 'rgba(253, 246, 227, 0.95)',
        text: '#3E2C1E',
        accent: '#F9B233',
        searchBg: '#FFFFFF',
        searchPlaceholder: '#5D4037',
        searchText: '#3E2C1E',
        iconColor: '#5D4037',
        cartBg: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
        cartText: '#3E2C1E',
        logoText: '#3E2C1E',
        logoAccent: '#F9B233'
    }, [isGroceryPage]);

    const handleDynamicButtonClick = useCallback(() => {
        if (isGroceryPage) {
            navigate('/');
        } else {
            navigate('/grocery', { state: { fromHome: true } });
        }
    }, [isGroceryPage, navigate]);

    return (
        <AppBar
            position="sticky"
            sx={{
                background: theme.bg,
                backdropFilter: 'blur(6px)',
                boxShadow: isGroceryPage ? '0 2px 10px rgba(19, 105, 52, 0.15)' : '0 2px 10px rgba(62, 44, 30, 0.06)',
                borderBottom: isGroceryPage ? 'none' : '1px solid rgba(62, 44, 30, 0.05)',
                zIndex: 1200,
                color: theme.text,
                transition: 'background 0.3s ease'
            }}
        >
            <Toolbar className="max-w-[1600px] mx-auto w-full flex items-center gap-4 lg:gap-8 py-3 px-4 lg:px-10 min-h-[80px]">

                {/* 1. LOGO & LOCATION */}
                <div className="flex flex-col gap-1 items-start">
                    <div
                        onClick={() => {
                            sessionStorage.removeItem('last_home_section');
                            navigate('/');
                        }}
                        className="cursor-pointer flex items-center gap-2 flex-shrink-0 select-none group"
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: theme.logoText,
                                letterSpacing: '-1px',
                                lineHeight: 1
                            }}
                        >
                            GSPL <span style={{ color: theme.logoAccent }}>Mart</span>
                        </Typography>
                    </div>

                    <div className={`hidden md:flex items-center gap-1 text-xs font-bold cursor-pointer transition-colors ${isGroceryPage ? 'text-green-100 hover:text-white' : 'text-gray-500 hover:text-[#D97706]'}`}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 14, color: theme.accent }} />
                        <span>Mumbai, 400001</span>
                    </div>
                </div>

                {/* 2. SEARCH BAR */}
                <div className={`
            flex-1 max-w-[600px] h-[50px] rounded-full flex items-center px-4 gap-3 transition-all duration-200 ml-4 lg:ml-8
        `}
                    style={{
                        backgroundColor: theme.searchBg,
                        boxShadow: isSearchFocused ? `0 0 0 2px ${theme.accent}` : '0 1px 3px rgba(0,0,0,0.1)',
                        border: isSearchFocused ? 'none' : '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <SearchIcon sx={{ color: isSearchFocused ? theme.accent : theme.iconColor, transition: 'color 0.3s' }} />
                    <InputBase
                        placeholder='Search for products...'
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        sx={{
                            fontSize: '15px',
                            color: isSearchFocused && isGroceryPage ? '#136934' : theme.searchText,
                            fontWeight: 500,
                            '& input::placeholder': { opacity: 0.7, color: isSearchFocused && isGroceryPage ? '#888' : theme.searchPlaceholder }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            minWidth: 'auto',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            bgcolor: theme.accent,
                            color: isGroceryPage ? '#136934' : '#fff',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { filter: 'brightness(1.1)' }
                        }}
                    >
                        Search
                    </Button>
                </div>

                {/* 3. NAVIGATION ACTIONS */}
                <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0 ml-auto">

                    {/* Dynamic Switch Button */}
                    <Button
                        onClick={handleDynamicButtonClick}
                        startIcon={isGroceryPage ? <HomeIcon /> : <ElectricBoltIcon />}
                        sx={{
                            color: theme.text,
                            border: `1.5px solid ${isGroceryPage ? 'rgba(255,255,255,0.3)' : 'rgba(62, 44, 30, 0.15)'}`,
                            background: 'transparent',
                            textTransform: 'none',
                            fontWeight: '700',
                            borderRadius: '12px',
                            px: 3,
                            minWidth: '160px',
                            height: '48px',
                            whiteSpace: 'nowrap',
                            display: { xs: 'none', md: 'flex' }, // Hidden on mobile, visible on tablet+
                            transition: 'all 0.3s',
                            '&:hover': {
                                background: isGroceryPage ? 'rgba(255,255,255,0.1)' : 'rgba(249, 178, 51, 0.1)',
                                borderColor: theme.accent,
                                color: theme.accent
                            }
                        }}
                    >
                        {isGroceryPage ? "Home" : "Groceries Instant"}
                    </Button>

                    {/* Seller Button - FIX: Changed breakpoint from 'xl' to 'md' */}
                    <Button
                        startIcon={<StorefrontIcon />}
                        sx={{
                            color: isGroceryPage ? 'rgba(255,255,255,0.8)' : '#5D4037',
                            textTransform: 'none',
                            fontWeight: 600,
                            height: '45px',
                            px: 2,
                            borderRadius: '12px',
                            display: { xs: 'none', md: 'flex' }, // <--- UPDATED THIS LINE
                            '&:hover': { background: 'rgba(0,0,0,0.05)', color: theme.accent }
                        }}
                        onClick={() => navigate('/become-seller')}
                    >
                        Become Seller
                    </Button>

                    {/* Profile Button */}
                    <IconButton
                        onClick={() => {
                            if (user) {
                                if (user?.role === "ROLE_SUPER") {
                                    navigate('/super-admin');
                                } else {
                                    navigate('/account');
                                }
                            } else {
                                setOpenAuthModal(true);
                            }
                        }}
                        sx={{
                            color: isGroceryPage ? 'rgba(255,255,255,0.8)' : '#5D4037',
                            border: `1px solid ${isGroceryPage ? 'rgba(255,255,255,0.2)' : 'rgba(62, 44, 30, 0.1)'}`,
                            borderRadius: '12px',
                            width: '45px',
                            height: '45px',
                            '&:hover': { borderColor: theme.accent, color: theme.accent, bgcolor: isGroceryPage ? 'rgba(255,255,255,0.1)' : '#FFF8E1' }
                        }}
                    >
                        <PersonOutlineIcon />
                    </IconButton>

                    {/* Cart Button */}
                    <Button
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/cart')}
                        sx={{
                            background: theme.cartBg,
                            color: theme.cartText,
                            textTransform: 'none',
                            fontWeight: '800',
                            fontSize: '15px',
                            borderRadius: '12px',
                            height: '48px',
                            px: 3,
                            boxShadow: isGroceryPage ? '0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(217, 119, 6, 0.3)',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                filter: 'brightness(1.1)'
                            }
                        }}
                    >
                        <Badge badgeContent={cart?.totalItem || 0} color="error" sx={{ '& .MuiBadge-badge': { right: -3, top: -3, bgcolor: isGroceryPage ? '#fff' : '#3E2C1E', color: isGroceryPage ? '#136934' : '#fff' } }}>
                            My Cart
                        </Badge>
                    </Button>
                </div>

            </Toolbar>

            {/* AUTH MODAL */}
            <AuthModal open={openAuthModal} handleClose={() => setOpenAuthModal(false)} />

        </AppBar>
    )
}

export default Navbar;