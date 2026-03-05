import React from 'react';
import './ShopByCategory.css';
import { useNavigate } from 'react-router-dom';

interface ShopByCategoryCardProps {
  item: {
    id: number;
    image: string;
    name: string;
    categoryId: string;
  };
}

const ShopBycategoryCard = ({ item }: ShopByCategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className='flex gap-3 flex-col justify-center items-center group cursor-pointer'
      onClick={() => navigate(`/products?category=${item.categoryId}`)}
    >
      <div className='custom-border w-[150px] h-[150px] rounded-full bg-primary-color overflow-hidden'>
        <img
          className='rounded-full group-hover:scale-95 transition-transform duration-700 object-cover h-full w-full'
          src={item.image || "https://placehold.co/150?text=No+Image"}
          alt={item.name}
        />
      </div>
      <h1 className='font-medium text-lg text-gray-800 group-hover:text-primary-color transition-colors duration-300'>
        {item.name}
      </h1>

    </div>
  );
};

export default ShopBycategoryCard;
