import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch } from '../../../../State/hooks';
import { addItemToCart } from '../../../../State/Cart/cartThunks';
import { useToast } from '../../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface GroceryCardProps {
  product: any; // Using any for flexibility or use the shared Product type
}

const GroceryCard = ({ product }: GroceryCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mapping API fields
  const image = product.images?.[0] || "https://via.placeholder.com/150";
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
    <div 
      className='bg-white border border-[#E8F5E9] rounded-2xl p-3 cursor-pointer hover:shadow-2xl hover:border-[#4CAF50] transition-all duration-500 h-full flex flex-col justify-between relative group overflow-hidden'
      onClick={() => navigate("/grocery/product/" + product.id)}
    >
      {/* Decorative background element on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#F1F8E9] rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 z-0 opacity-50"></div>


      {/* Image Section */}
      <div className='relative w-full h-[150px] flex justify-center items-center mb-3 bg-white rounded-xl overflow-hidden z-10'>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110'
        />
      </div>


      {/* Time Badge - Updated to Yellow/Brown theme */}
      <div className='bg-[#FFF9C4] border border-[#FBC02D] rounded-full px-3 py-[3px] inline-flex items-center gap-1.5 w-fit absolute top-3 left-3 shadow-md z-20 animate-pulse-gentle'>
        <AccessTimeIcon sx={{ fontSize: 12, color: '#F57F17' }} />
        <span className='text-[10px] font-black text-[#F57F17] tracking-wider'>8 MINS</span>
      </div>


      {/* Content */}
      <div className='space-y-1.5 flex flex-col flex-1 z-10'>
        {/* Title - Darker Green for better hierarchy */}
        <h3 className='font-extrabold text-[#1B5E20] text-[14px] leading-tight line-clamp-2 h-[38px] group-hover:text-[#2E7D32] transition-colors'>
          {name}
        </h3>
        {/* Weight - Muted Green */}
        <p className='text-[#66BB6A] text-[11px] font-medium tracking-wide'>{weight}</p>


        <div className='flex items-center justify-between mt-auto pt-3'>
          <div className='flex flex-col'>
            <span className='text-[#1B5E20] font-black text-base'>₹{price}</span>
            <span className='text-[#A5D6A7] text-[10px] line-through font-medium'>₹{mrp}</span>

          </div>

          {/* Add Button - Updated to Orange Theme */}
          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={loading}
            sx={{
              bgcolor: '#FFB300',
              color: '#1B5E20',
              textTransform: 'none',
              fontWeight: '900',
              minWidth: '70px',
              height: '34px',
              fontSize: '13px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(255, 179, 0, 0.2)',
              '&:hover': {
                bgcolor: '#FFA000',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(255, 179, 0, 0.3)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            {loading ? <CircularProgress size={18} sx={{ color: '#1B5E20' }} /> : "ADD"}
          </Button>

        </div>
      </div>


      <style>{`
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite ease-in-out;
        }
      `}</style>
    </div>

  )
}

export default GroceryCard;
