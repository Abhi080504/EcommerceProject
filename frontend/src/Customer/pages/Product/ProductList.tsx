import React, { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { fetchProducts, searchProducts } from "../../../State/product/productThunks";
import ProductCard from "./ProductCard";
import { GridSkeleton } from "../../../components/Shared/Skeletons";

const ProductList = () => {

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { category: paramCategory } = useParams<{ category: string }>();

  const { items, page, loading } = useAppSelector(
    (state) => state.products
  );

  // Helper to parse query params
  const searchParams = new URLSearchParams(location.search);
  const category = paramCategory || searchParams.get("category");
  const brand = searchParams.get("brand");
  const color = searchParams.get("color");
  const sort = searchParams.get("sort");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const query = searchParams.get("query"); // <--- Get the search query

  // -------- AUTO SCROLL TO TOP ON NAVIGATION --------
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [category, query]);


  // -------- FETCH PRODUCTS ON PAGE LOAD & FILTER CHANGE --------
  useEffect(() => {
    // If there is a search query, use the searchThunk
    if (query) {
      dispatch(searchProducts(query));
      return;
    }

    // Otherwise use standard filtering
    const filters = {
      pageNumber: page.pageNumber ?? 0,
      category: category || undefined,
      brand: brand || undefined,
      color: color || undefined,
      sort: sort || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined
    };

    dispatch(fetchProducts(filters));
  }, [dispatch, page.pageNumber, category, brand, color, sort, minPrice, maxPrice, query]);


  // -------- HANDLERS --------
  const handleNext = () => {
    if (!page.isLast) {
      dispatch(
        fetchProducts({
          pageNumber: page.pageNumber + 1,
          category: category || undefined, // keep existing filters
          brand: brand || undefined,
          color: color || undefined,
          sort: sort || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined
        })
      );
    }
  };

  const handlePrev = () => {
    if (page.pageNumber > 0) {
      dispatch(
        fetchProducts({
          pageNumber: page.pageNumber - 1,
          category: category || undefined,
          brand: brand || undefined,
          color: color || undefined,
          sort: sort || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined
        })
      );
    }
  };

  // -------- UTILING FOR FORMATTING --------
  const formatCategoryName = (name: string) => {
    return name
      .split(/_|-/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className='relative min-h-screen bg-[#F5F1E8] overflow-hidden selection:bg-[#F9B233] selection:text-[#3E2C1E]'>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-10 py-12 space-y-8">

        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/80 rounded-2xl text-[#3E2C1E] font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-[#F9B233] hover:border-[#F9B233] hover:shadow-md hover:-translate-x-1 transition-all duration-200 w-fit"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back to Selection
        </button>

        {/* --- HEADER SECTION --- */}
        <div className="bg-white/30 border border-white/60 rounded-[32px] p-6 md:p-10 shadow-[0_4px_20px_0_rgba(62,44,30,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          {/* Decorative radial gradient background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F9B233]/10 to-transparent rounded-full -mr-32 -mt-32"></div>

          <div className="flex items-start gap-5 relative z-10">
            <span className="w-2 h-12 bg-[#F9B233] rounded-full shadow-[0_0_20px_rgba(249,178,51,0.4)] mt-1.5"></span>
            <div>
              <span className="text-[#F9B233] uppercase text-[10px] md:text-xs font-black tracking-[4px] block mb-2 opacity-80">
                Exclusive Collection
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter leading-tight">
                {category ? formatCategoryName(category) : "Our Designs"}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="bg-white/70 px-6 py-3 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[#3E2C1E] font-black text-sm tracking-tight uppercase">
                    {items.length} Products Found
                </span>
             </div>
          </div>
        </div>

        {/* --- CONTENT AREA & GLASS CONTAINER --- */}
        <div className="bg-white/25 border border-white/50 rounded-[48px] p-6 md:p-10 shadow-[0_10px_30px_rgba(62,44,30,0.04)] min-h-[60vh] relative overflow-hidden">
          
          {/* Decorative inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#F9B233]/40 to-transparent"></div>

          {loading ? (
            <GridSkeleton count={8} />
          ) : (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                   <div className="w-20 h-20 bg-[#FDF6E3] rounded-full flex items-center justify-center border border-[#F9B233]/20">
                      <span className="text-4xl">📦</span>
                   </div>
                   <h2 className="text-xl font-bold text-[#3E2C1E]">No products found</h2>
                   <p className="text-gray-500 max-w-sm">We couldn't find any items matching this category. Please try another one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title ?? "Untitled Product"}
                      price={product.sellingPrice}
                      mrp={product.mrpPrice}
                      discount={product.discountPercent}
                      image={
                        product.images?.[0] ??
                        "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      product={product}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          
          {/* --- PAGINATION --- */}
          {!loading && items.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#3E2C1E]/5">
              <button
                onClick={handlePrev}
                disabled={page.pageNumber === 0}
                className="flex items-center gap-2 px-8 py-3.5 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-[#3E2C1E]/20 rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(62,44,30,0.08)] hover:shadow-[0_6px_20px_rgba(62,44,30,0.12)] hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-[#3E2C1E] font-black tracking-wider">PREVIOUS</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[#3E2C1E] font-black text-sm tracking-widest uppercase opacity-40">Page</span>
                <span className="text-[#F9B233] font-black text-2xl">
                  {page.pageNumber + 1 < 10 ? `0${page.pageNumber + 1}` : page.pageNumber + 1}
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={page.isLast}
                className="flex items-center gap-2 px-8 py-3.5 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-[#3E2C1E]/20 rounded-2xl transition-all duration-200 shadow-[0_4px_15px_rgba(62,44,30,0.08)] hover:shadow-[0_6px_20px_rgba(62,44,30,0.12)] hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-[#3E2C1E] font-black tracking-wider">NEXT</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Animation Styles */}
      <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ProductList;
