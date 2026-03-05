import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch } from '../../../../State/hooks';
import { addItemToCart } from '../../../../State/Cart/cartThunks';
import { useToast } from '../../../../context/ToastContext';

interface GroceryCardProps {
  product: any; // Using any for flexibility or use the shared Product type
}

const GroceryCard = ({ product }: GroceryCardProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mapping API fields
  const image = product.images?.[0] || "https://placehold.co/150?text=No+Image";
  const name = product.title || "Product";
  const weight = product.sizes || product.weight || "1 unit"; // Use sizes or weight
  const price = product.sellingPrice;
  const mrp = product.mrpPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const inititalQuantity = 1;
      const sizeToUse = product.sizes || "One Size"; // Default size if missing

      const req = {
        productId: product.id,
        size: sizeToUse,
        quantity: inititalQuantity,
        product: product // 🔹 Pass product for guest cart
      };

      await dispatch(addItemToCart(req)).unwrap();

      showToast("Item added to cart!", "success");
    } catch (error) {
      console.error("Add to cart failed", error);
      showToast("Could not add item to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white border border-[#FDE3CF] rounded-2xl p-3 cursor-pointer hover:shadow-xl hover:border-[#F8A91F] transition-all duration-300 h-full flex flex-col justify-between relative group'>

      {/* Image Section */}
      <div className='relative w-full h-[140px] flex justify-center items-center mb-2 bg-white rounded-xl overflow-hidden'>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-contain hover:scale-105 transition-transform duration-500'
        />
      </div>

      {/* Time Badge - Updated to Yellow/Brown theme */}
      <div className='bg-[#FFF5E6] border border-[#FDE3CF] rounded-md px-2 py-[2px] inline-flex items-center gap-1 w-fit absolute top-3 left-3 shadow-sm'>
        <AccessTimeIcon sx={{ fontSize: 10, color: '#632713' }} />
        <span className='text-[10px] font-bold text-[#632713]'>8 MINS</span>
      </div>

      {/* Content */}
      <div className='space-y-1 flex flex-col flex-1'>
        {/* Title - Brown */}
        <h3 className='font-bold text-[#632713] text-[13px] leading-tight line-clamp-2 h-[34px]'>
          {name}
        </h3>
        {/* Weight - Lighter Brown */}
        <p className='text-[#8D5A46] text-xs'>{weight}</p>

        <div className='flex items-center justify-between mt-auto pt-3'>
          <div className='flex flex-col'>
            <span className='text-[#632713] font-bold text-sm'>₹{price}</span>
            <span className='text-[#8D5A46] text-xs line-through'>₹{mrp}</span>
          </div>

          {/* Add Button - Updated to Orange Theme */}
          <Button
            variant="outlined"
            onClick={handleAddToCart}
            disabled={loading}
            sx={{
              color: '#EC6426',
              borderColor: '#EC6426',
              backgroundColor: '#FFF5E6', // Very light orange/cream
              textTransform: 'none',
              fontWeight: '800',
              minWidth: '65px',
              height: '32px',
              fontSize: '12px',
              borderRadius: '8px',
              borderWidth: '1px',
              '&:hover': {
                backgroundColor: '#EC6426',
                color: 'white',
                borderColor: '#EC6426',
                boxShadow: '0 2px 5px rgba(236, 100, 38, 0.3)'
              }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: '#EC6426' }} /> : "ADD"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GroceryCard;
