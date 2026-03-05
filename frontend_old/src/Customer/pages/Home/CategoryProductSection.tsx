import React, { useEffect, useRef, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { api } from '../../../config/Api';

interface Product {
    id: number;
    title: string;
    images: string[];
    sellingPrice: number;
    discountPercent: number;
}

interface CategoryProductSectionProps {
    categoryName?: string; // Optional: if missing, fetch all products
    tagName: string;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({ categoryName, tagName }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Construct URL: If categoryName exists, filter by it. Else generic fetch.
                const url = categoryName
                    ? `/products?category=${categoryName}&pageSize=10`
                    : `/products?pageSize=10`;

                const res = await api.get(url);
                setProducts(res.data.data.content || []);
            } catch (error) {
                console.error(`Failed to fetch products for section: ${tagName}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    if (loading) {
        // Optional: Skeleton or simple loading state
        return (
            <div className='py-6 px-4 lg:px-6 relative z-20 group bg-white border-b border-gray-100 flex justify-center'>
                <CircularProgress size={30} sx={{ color: '#F9B233' }} />
            </div>
        );
    }

    return (
        <div className='py-6 px-4 lg:px-6 relative z-20 group bg-white border-b border-gray-100'>

            {/* Header */}
            <div className='px-4 lg:px-5 py-4 flex justify-between items-center border-b border-gray-100'>
                <h2 className='text-[22px] font-medium text-black'>{tagName}</h2>

                <div className='flex gap-2'>
                    <IconButton
                        onClick={() => scroll(-300)}
                        sx={{ bgcolor: '#2874f0', color: 'white', height: '36px', width: '36px', boxShadow: 2, '&:hover': { bgcolor: '#1c54b2' } }}
                        disabled={products.length < 5}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => scroll(300)}
                        sx={{ bgcolor: '#2874f0', color: 'white', height: '36px', width: '36px', boxShadow: 2, '&:hover': { bgcolor: '#1c54b2' } }}
                        disabled={products.length < 5}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 scrollbar-hide py-4 px-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {products.length === 0 ? (
                    <div className="w-full h-[200px] flex flex-col items-center justify-center text-gray-400 gap-2">
                        <span className="text-lg font-medium">No products found</span>
                        <span className="text-sm">Try adding products to "{tagName}" in Seller Dashboard</span>
                    </div>
                ) : (
                    products.map((item) => (
                        <Link
                            to={`/product/${item.id}`}
                            key={item.id}
                            className="min-w-[160px] md:min-w-[190px] snap-start h-full cursor-pointer hover:shadow-lg transition-shadow rounded-md p-3 border border-transparent hover:border-gray-200 block text-inherit no-underline"
                        >
                            {/* Card Layout */}
                            <div className="w-full h-[150px] mb-3 flex items-center justify-center p-2">
                                <img
                                    src={item.images[0]}
                                    alt={item.title}
                                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="font-medium text-gray-800 text-[14px] leading-tight line-clamp-2 min-h-[40px]">
                                    {item.title}
                                </h3>
                                <p className="text-black font-bold text-[15px]">
                                    ₹{item.sellingPrice} <span className='text-green-600 text-xs font-medium ml-1'>{item.discountPercent}% off</span>
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Navigation Buttons (Floating) */}
            <div className="absolute left-0 top-[55%] -translate-y-1/2 hidden lg:group-hover:block z-10">
                <IconButton
                    onClick={() => scroll(-300)}
                    sx={{
                        bgcolor: 'white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        height: '40px',
                        width: '40px',
                        borderRadius: '4px',
                        '&:hover': { bgcolor: 'white' }
                    }}
                >
                    <ChevronLeftIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
            <div className="absolute right-0 top-[55%] -translate-y-1/2 hidden lg:group-hover:block z-10">
                <IconButton
                    onClick={() => scroll(300)}
                    sx={{
                        bgcolor: 'white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        height: '40px',
                        width: '40px',
                        borderRadius: '4px',
                        '&:hover': { bgcolor: 'white' }
                    }}
                >
                    <ChevronRightIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
        </div>
    )
}

export default CategoryProductSection;
