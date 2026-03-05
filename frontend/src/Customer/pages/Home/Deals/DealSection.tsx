import React, { useEffect, useState } from 'react';
import { api } from '../../../../config/Api';
import { Typography } from '@mui/material';

const DealSection = () => {
    const [deals, setDeals] = useState<any[]>([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await api.get("/deals");
                console.log("Deals Fetched:", res.data);
                setDeals(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch deals", error);
            }
        };

        fetchDeals();
    }, []);

    if (deals.length === 0) {
        console.log("No deals found, hiding section.");
        return null;
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center gap-3 px-2">
                {/* Accent Bar: Red for Deals */}
                <span className="w-1.5 h-8 bg-[#EF4444] rounded-full"></span>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#3E2C1E', letterSpacing: '-0.5px' }}>
                    Hot Deals
                </Typography>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {deals.map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => sessionStorage.setItem('last_home_section', 'deal-section')}
                        className='group cursor-pointer relative bg-white/80 backdrop-blur-md rounded-[28px] p-5 shadow-[0_8px_30px_-10px_rgba(239,68,68,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.15)] border border-[#3E2C1E]/5 hover:border-[#EF4444]/30 transition-all duration-500'
                    >

                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                            {item.discount}% OFF
                        </div>

                        {/* Image */}
                        <div className='h-[140px] w-full flex items-center justify-center overflow-hidden mb-4 rounded-xl bg-gray-50'>
                            <img
                                src={item.category?.image}
                                alt={item.category?.name}
                                className='max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply'
                            />
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <Typography
                                variant='subtitle1'
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 0.5
                                }}
                            >
                                {item.category?.name}
                            </Typography>
                            <Typography variant='body2' className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                Limited Time
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealSection;
