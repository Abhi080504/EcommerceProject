import React, { useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { fetchSimilarProducts } from '../../../State/product/productThunks';
import ProductCard from './ProductCard';

type SimilarProductProps = {
  categoryId: string;
  currentProductId: number;
};

const SimilarProduct: React.FC<SimilarProductProps> = ({ categoryId, currentProductId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Select similar products from Redux
  const { similarProducts } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSimilarProducts({ categoryId }));
    }
  }, [categoryId, dispatch]);

  // Filter out current product
  const filteredProducts = similarProducts.filter(p => p.id !== currentProductId);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // If no similar products found, return null or empty
  if (!filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className='relative group my-10'>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Similar Products</h2>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 scrollbar-hide py-4 px-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {filteredProducts.map((item: any) => (
          <div
            key={item.id}
            className="min-w-[220px] md:min-w-[260px] snap-start h-auto"
          >
            <ProductCard
              id={item.id}
              title={item.title}
              price={item.sellingPrice}
              mrp={item.mrpPrice}
              discount={item.discountPercent}
              image={item.images?.[0]}
              product={item}
            />
          </div>
        ))}
      </div>

      {/* --- Navigation Buttons (Visible on Hover) --- */}

      {/* Left Button */}
      <div className="absolute left-0 top-[55%] -translate-y-1/2 -ml-4 hidden group-hover:block z-10">
        <IconButton
          onClick={() => scroll(-300)}
          sx={{
            bgcolor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            height: '40px',
            width: '40px',
            '&:hover': { bgcolor: 'white', color: '#2874f0' }
          }}
        >
          <ChevronLeftIcon sx={{ color: 'black' }} />
        </IconButton>
      </div>

      {/* Right Button */}
      <div className="absolute right-0 top-[55%] -translate-y-1/2 -mr-4 hidden group-hover:block z-10">
        <IconButton
          onClick={() => scroll(300)}
          sx={{
            bgcolor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            height: '40px',
            width: '40px',
            '&:hover': { bgcolor: 'white', color: '#2874f0' }
          }}
        >
          <ChevronRightIcon sx={{ color: 'black' }} />
        </IconButton>
      </div>
    </div>
  )
}

export default SimilarProduct;
