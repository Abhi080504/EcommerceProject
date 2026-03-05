import React, { useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { fetchSimilarProducts } from '../../../State/product/productThunks';
import ProductCard from '../Product/ProductCard';

type SimilarProductProps = {
    categoryId?: string;
    currentProductId: number;
    isGrocery?: boolean;
};

const SimilarProduct: React.FC<SimilarProductProps> = ({ categoryId, currentProductId, isGrocery }) => {
    const theme = {
        primary: isGrocery ? "#1B5E20" : "#3E2C1E",
        accent: isGrocery ? "#FFB300" : "#F9B233",
        shadow: isGrocery ? "rgba(27, 94, 32, 0.05)" : "rgba(62, 44, 30, 0.05)",
    };
    const scrollRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    // Select similar products from Redux
    const { similarProducts } = useAppSelector((state) => state.products);

    useEffect(() => {
        // Fetch similar products (if categoryId is missing, thunk fetches newest)
        dispatch(fetchSimilarProducts({ categoryId }));
    }, [categoryId, dispatch]);

    // Secondary effect: If category results are empty, fetch generic ones
    useEffect(() => {
        if (categoryId && similarProducts.length <= 1) { // 1 because current product might be there
            // Try fetching without categoryId to get a fallback
            dispatch(fetchSimilarProducts({ }));
        }
    }, [categoryId, similarProducts.length, dispatch]);

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
        <div className='relative group pb-10'>

            <div className="flex items-center gap-5 mb-12">
               <span style={{ backgroundColor: theme.accent, boxShadow: `0 0 15px ${theme.accent}4d` }} className="w-2.5 h-12 rounded-full"></span>
               <div>
                 <span style={{ color: theme.accent }} className="uppercase text-[10px] font-black tracking-[4px] block mb-2 opacity-80">You might also love</span>
                 <h2 style={{ color: theme.primary }} className="text-3xl md:text-5xl font-black tracking-tighter">Exclusively For You</h2>
               </div>
            </div>

            {/* Scrollable Container with Glass Panel */}
            <div 
                style={{ boxShadow: `0 20px 50px ${theme.shadow}` }}
                className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[48px] p-6 md:p-10"
            >
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 scrollbar-hide py-4 px-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {filteredProducts.map((item: any) => (
                        <div
                            key={item.id}
                            className="min-w-[240px] md:min-w-[280px] snap-start h-auto"
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
            </div>
        </div>
    )
}

export default SimilarProduct;