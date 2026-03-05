import React, { useEffect, useRef, useState, useCallback } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { api } from "../../../config/Api";

interface Product {
  id: number;
  title: string;
  images: string[];
  sellingPrice: number;
  discountPercent: number;
}

interface CategoryProductSectionProps {
  id: string;
  categoryName?: string; // Optional: if missing, fetch all products
  tagName: string;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  id,
  categoryName,
  tagName,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleImageError = (productId: number) => {
    setImageError((prev) => ({ ...prev, [productId]: true }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Construct URL: If categoryName exists, filter by it. Else generic fetch.
        const url = categoryName
          ? `products?category=${categoryName}&pageSize=10`
          : `products?pageSize=10`;

        const res = await api.get(url);
        // Defensive access: Check for ApiResponse structure (res.data.data)
        const payload = res.data?.data;
        const items = payload?.content || payload || [];
        setProducts(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error(
          `Failed to fetch products for section: ${tagName}`,
          error,
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, tagName]); // Re-add tagName to ensure correct loading for sections with same categoryName

  const scroll = useCallback((offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <CircularProgress size={40} sx={{ color: "#F9B233" }} />
      </div>
    );
  }

  return (
    <div className="relative z-20 group">
      {/* Header */}
      <div className="px-4 lg:px-5 py-4 flex justify-between items-center border-b border-gray-100/50 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#F9B233] rounded-full"></span>
          <h2 className="text-[22px] font-black text-[#3E2C1E] tracking-tight">
            {tagName}
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide py-4 px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.length === 0 ? (
          <div className="w-full h-[200px] flex flex-col items-center justify-center text-gray-400 gap-2">
            <span className="text-lg font-medium">No products found</span>
            <span className="text-sm">
              Try adding products to "{tagName}" in Seller Dashboard
            </span>
          </div>
        ) : (
          products.map((item) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              onClick={() => sessionStorage.setItem('last_home_section', id)}
              className="min-w-[180px] md:min-w-[220px] snap-start h-full cursor-pointer bg-white/60 rounded-[24px] p-5 border border-[#3E2C1E]/5 hover:border-[#F9B233]/40 shadow-[0_4px_15px_-5px_rgba(62,44,30,0.06)] hover:shadow-[0_10px_25px_-8px_rgba(62,44,30,0.12)] hover:-translate-y-1.5 transition-all duration-300 block text-inherit no-underline group/card overflow-hidden relative"
            >
              {/* Card Layout */}
              <div className="w-full h-[180px] mb-5 flex items-center justify-center p-3 bg-white/80 rounded-2xl overflow-hidden relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                {imageError[item.id] ? (
                  <div className="w-full h-full bg-[#FDF6E3] flex flex-col items-center justify-center text-[#F9B233] opacity-60">
                    <img
                      src="https://static-00.iconduck.com/assets.00/image-not-found-icon-2048x2048-96860un1.png"
                      className="w-12 h-12 mb-1 grayscale opacity-30"
                      alt="Placeholder"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <img
                    src={(item.images && item.images[0]) || (item as any).image}
                    alt={item.title}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover/card:scale-110"
                    onError={() => handleImageError(item.id)}
                  />
                )}

                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-[#F9B233] text-[#3E2C1E] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-10">
                  -{item.discountPercent}%
                </div>
              </div>

              <div className="text-center space-y-1 z-10 relative">
                <h3 className="font-extrabold text-[#3E2C1E] text-[14px] leading-tight line-clamp-2 min-h-[40px] group-hover/card:text-[#F9B233] transition-colors duration-200">
                  {item.title || (item as any).name || "Unnamed Product"}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-[#3E2C1E] font-black text-[16px]">
                    ₹{item.sellingPrice}
                  </p>
                  {item.discountPercent > 0 && (
                    <span className="text-gray-400 text-[10px] line-through font-medium">
                      ₹
                      {Math.round(
                        item.sellingPrice / (1 - item.discountPercent / 100),
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Simplified decorative element */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#F9B233]/10 rounded-full blur-lg group-hover/card:bg-[#F9B233]/15 transition-all duration-300"></div>
            </Link>
          ))
        )}
      </div>

      {/* Navigation Buttons (Floating) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:group-hover:flex items-center justify-center -ml-5 z-30">
        <IconButton
          onClick={() => scroll(-350)}
          sx={{
            bgcolor: "white",
            color: "#3E2C1E",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            height: "48px",
            width: "48px",
            borderRadius: "14px",
            border: "1px solid #F9B233",
            "&:hover": {
              bgcolor: "#F9B233",
              color: "white",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:group-hover:flex items-center justify-center -mr-5 z-30">
        <IconButton
          onClick={() => scroll(350)}
          sx={{
            bgcolor: "white",
            color: "#3E2C1E",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            height: "48px",
            width: "48px",
            borderRadius: "14px",
            border: "1px solid #F9B233",
            "&:hover": {
              bgcolor: "#F9B233",
              color: "white",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s",
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default CategoryProductSection;
