import React from 'react'
import { useNavigate } from 'react-router-dom';

interface DealCardProps {
  deal: any; // Replace with proper interface if available
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const navigate = useNavigate();
  return (
    <div className='w-[13rem] cursor-pointer' onClick={() => navigate(`/products?category=${deal?.homeCategory?.categoryId}`)}>
      <img
        className='border-x-[7px] border-t-[7px] border-pink-600 w-full h-[12rem] object-cover object-top'
        src={deal?.homeCategory?.image || "https://placehold.co/200?text=No+Image"}
        alt={deal?.homeCategory?.categoryId || "Deal"} />
      <div className='border-4 border-black bg-black text-white p-2 text-center'>
        <p className='text-lg font-semibold'>{deal?.homeCategory?.categoryId?.replaceAll("_", " ")}</p>
        <p className='text-2xl font-bold'>{deal?.discount}% OFF</p>
        <p className='text-balance text-lg'>Shop now</p>
      </div>
    </div>
  )
}

export default DealCard
