import { Divider, Paper } from '@mui/material';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Orders from './Orders';
import OrderDetails from './OrderDetails';
import UserDetails from './UserDetails';
import Address from './Address';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { loadUserProfile, performLogout } from '../../../State/Auth/authSlice';

const menu = [
    { name: "My Orders", path: "/account/orders", icon: <ShoppingBagIcon /> },
    { name: "Profile", path: "/account", icon: <PersonIcon /> },
    { name: "Saved Addresses", path: "/account/addresses", icon: <LocationOnIcon /> },
    { name: "Logout", path: "/", icon: <LogoutIcon /> }
];

const Account = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { jwt, user, seller, isAuthChecked } = useAppSelector(state => state.auth);

    // 🔐 Protect route + 🔥 Load user profile
    React.useEffect(() => {
        if (!user && !seller && !isAuthChecked) {
            dispatch(loadUserProfile());
        }

        // Redirect based on role
        if (user?.role === "ROLE_ADMIN") {
            navigate("/admin");
        } else if (user?.role === "ROLE_SUPER") {
            navigate("/super-admin");
        } else if (user?.role === "ROLE_SELLER" || seller) {
            navigate("/seller");
        }

        // If auth checked and still no user/seller, maybe redirect to login?
        // But Navbar handles AuthModal, so we can stay here or redirect home.
    }, [user, seller, isAuthChecked, dispatch, navigate]);

    const handleClick = (item: any) => {
        if (item.name === "Logout") {
            dispatch(performLogout());
        } else {
            navigate(item.path);
        }
    };

    return (
        <div className='px-5 lg:px-20 min-h-screen pt-10 bg-[#F9F9F9]'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6'>

                    {/* SIDEBAR */}
                    <section className='col-span-1'>
                        <Paper elevation={0} className='rounded-xl border border-gray-200 overflow-hidden sticky top-24'>
                            <div className='p-5 bg-white'>
                                <h2 className='text-xl font-bold text-gray-800'>Account</h2>
                                <p className='text-sm text-gray-500'>Manage your orders & details</p>
                            </div>
                            <Divider />
                            <div className='flex flex-col bg-white'>
                                {menu.map((item) => {
                                    const isActive =
                                        location.pathname === item.path ||
                                        (item.path !== "/account" && location.pathname.startsWith(item.path));

                                    return (
                                        <div
                                            onClick={() => handleClick(item)}
                                            key={item.name}
                                            className={`
                                                flex items-center gap-3 px-5 py-4 cursor-pointer transition-all duration-200
                                                ${isActive
                                                    ? "bg-[#FFF0E3] text-[#D97706] border-l-4 border-[#D97706]"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#D97706] border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className={`${isActive ? "text-[#D97706]" : "text-gray-400"}`}>
                                                {item.icon}
                                            </span>
                                            <p className='font-medium'>{item.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Paper>
                    </section>

                    {/* MAIN CONTENT */}
                    <section className='col-span-1'>
                        <Routes>
                            <Route path='/' element={<UserDetails />} />
                            <Route path='/orders' element={<Orders />} />
                            <Route path='/order/:orderId/:orderItemId' element={<OrderDetails />} />
                            <Route path='/addresses' element={<Address />} />
                        </Routes>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Account;
