import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../config/Api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("home-categories");

        // Defensive access for varied API response structures
        const payload = res.data?.data;
        const items = Array.isArray(payload) ? payload : (payload?.content || []);
        setCategories(items);
      } catch (error) {
        console.error("Failed to fetch home categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);
  
  if (categories.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8'>


      {categories.map((item, idx) => (
        <div
          key={idx}
          onClick={() => {
            sessionStorage.setItem('last_home_section', 'category-grid');
            navigate(`/products/${item.categoryId}`);
          }}
          className='group relative cursor-pointer p-6 bg-white/60 rounded-[32px] border border-[#3E2C1E]/5 shadow-[0_4px_15px_-5px_rgba(62,44,30,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_-8px_rgba(249,178,51,0.2)] hover:bg-white hover:border-[#F9B233]/30 overflow-hidden text-center'
        >
          {/* Simplified Background Accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#F9B233] rounded-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-[1.5] opacity-[0.03] group-hover:opacity-[0.06] z-0"></div>

            {/* Image Container */}
          <div className='relative h-[110px] w-full flex items-center justify-center overflow-hidden mb-4 z-10'>
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className='max-h-full max-w-full object-contain transition-all duration-500 ease-out group-hover:scale-110'
            />
            {/* Simplified light reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
          </div>

          {/* Text Content */}
          <Typography
            variant='body2'
            sx={{
              fontSize: '15px',
              fontWeight: 900,
              color: '#3E2C1E',
              letterSpacing: '-0.2px',
              transition: 'all 0.3s',
              position: 'relative',
              zIndex: 10,
              '.group:hover &': { color: '#F9B233' }
            }}
          >
            {item.name}
          </Typography>

          
          {/* Simplified indicator bar */}
          <div className="w-8 h-1 bg-[#F9B233] mx-auto mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center opacity-70"></div>

        </div>
      ))}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export default React.memo(CategoryGrid);