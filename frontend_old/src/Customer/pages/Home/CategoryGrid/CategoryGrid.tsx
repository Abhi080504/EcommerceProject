import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../config/Api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/home-categories");
        // Filter for SHOP_BY_CATEGORIES or GRID if needed, or just display all
        // For now, based on user request, we display all fetched categories or filter by section if applicable
        // The backend model has 'section' enum. Let's filter if we want specific ones, 
        // but usually "Shop by Category" implies a specific section. 
        // Let's assume we display all valid entries with images.
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch home categories", error);
      }
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>

      {categories.map((item, idx) => (
        <div
          key={idx}
          onClick={() => navigate(`/products/${item.categoryId}`)}
          className='group cursor-pointer p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200 text-center'
        >

          {/* Image Container */}
          <div className='h-[100px] w-full flex items-center justify-center overflow-hidden mb-3'>
            <img
              src={item.image}
              alt={item.name}
              className='max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300'
            />
          </div>

          {/* Text Content */}
          <Typography
            variant='body2'
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#3E2C1E',
            }}
          >
            {item.name}
          </Typography>
        </div>
      ))}
    </div>
  )
}

export default CategoryGrid;