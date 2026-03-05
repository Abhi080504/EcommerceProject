import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";

import { clearSelected } from "../../../State/product/productSlice";
import { fetchProductById } from "../../../State/product/productThunks";
import { addItemToCart } from "../../../State/Cart/cartThunks";
import { fetchReviewsByProductId, createReview, deleteReview } from "../../../State/review/reviewSlice";

import { Button, Divider, Rating, TextField, Box, LinearProgress } from "@mui/material";

import { useToast } from "../../../context/ToastContext";
import SimilarProduct from "./SimilarProduct";
import ReviewCard from "../Review/ReviewCard";
import ProductStickyNavigation from "./ProductStickyNavigation";
import ImageModalZoom from "./ImageModalZoom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProductDetails = () => {

  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { selected: product, loading } = useAppSelector(
    (state) => state.products
  );
  const { reviews } = useAppSelector(state => state.reviews);
  const { user } = useAppSelector(state => state.auth);

  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState<number | null>(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // ---------- Load product ----------
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
      dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    }

    // cleanup on unmount
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    const req = {
      productId: product.id,
      size: product.sizes || "M",
      quantity: 1,
      product: product
    };
    try {
      await dispatch(addItemToCart(req)).unwrap();
      showToast("Item added to cart", "success");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      showToast("Failed to add item to cart", "error");
    }
  };

  const handleSubmitReview = async () => {
    if (!productId || !user) {
      showToast("Please login to write a review", "error");
      return;
    }
    try {
      await dispatch(createReview({
        productId: Number(productId),
        reviewText,
        reviewRating: ratingValue || 0,
        productImages: []
      })).unwrap();
      showToast("Review submitted successfully", "success");
      setWriteReviewOpen(false);
      setReviewText("");
    } catch (e) {
      showToast("Failed to submit review", "error");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      showToast("Review deleted", "success");
    } catch (e) {
      showToast("Failed to delete review", "error");
    }
  };


  // ---------- AUTO SCROLL TO TOP ON MOUNT ----------
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [productId]);

  // ---------- Categorization Logic ----------
  const checkIsGrocery = (cat: any): boolean => {
    if (!cat) return false;
    if (cat.categoryId?.toLowerCase().includes('grocer')) return true;
    if (cat.name?.toLowerCase().includes('grocer')) return true;
    if (cat.parentCategory) return checkIsGrocery(cat.parentCategory);
    return false;
  };

  const isGrocery = product ? checkIsGrocery(product.category) : false;

  // ---------- Theme definition ----------
  const theme = {
    bg: isGrocery ? "#F1F8E9" : "#F5F1E8",
    primary: isGrocery ? "#1B5E20" : "#3E2C1E",
    accent: isGrocery ? "#FFB300" : "#F9B233",
    accentLight: isGrocery ? "rgba(255, 179, 0, 0.1)" : "rgba(249, 178, 51, 0.1)",
    blob1: isGrocery ? "#C8E6C9" : "#F9B233",
    blob2: isGrocery ? "#A5D6A7" : "#3E2C1E",
    selectionBg: isGrocery ? "#1B5E20" : "#F9B233",
    selectionText: isGrocery ? "#FFFFFF" : "#3E2C1E",
  };

  if (loading || !product) {
    return (
      <div className={`min-h-screen bg-[${theme.bg}] flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
           <div className={`w-16 h-16 border-4 border-[${theme.accent}]/20 border-t-[${theme.accent}] rounded-full animate-spin`}></div>
           <p className={`text-[${theme.primary}] font-bold tracking-tight`}>Curating your selection...</p>
        </div>
      </div>
    );
  }

  // ---------- Safe values ----------
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://via.placeholder.com/400x400?text=No+Image"];
  
  const image = images[0];

  const title = product.title ?? "Product";
  const description = product.description ?? "No description available";

  // ---------- UTILING FOR FORMATTING --------
  const formatCategoryName = (name: string) => {
    if (!name) return "";
    return name
      .split(/_|-/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div style={{ backgroundColor: theme.bg }} className={`relative min-h-screen overflow-hidden pb-20`}>
      <style>{`
        ::selection {
          background-color: ${theme.selectionBg};
          color: ${theme.selectionText};
        }
      `}</style>
      
      {/* Decorative Blobs */}
      <div 
        style={{ backgroundColor: theme.blob1 }} 
        className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob pointer-events-none"
      ></div>
      <div 
        style={{ backgroundColor: theme.blob2 }} 
        className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[120px] opacity-5 animate-blob animation-delay-4000 pointer-events-none"
      ></div>

      <ProductStickyNavigation isGrocery={isGrocery} />

      <div className="relative z-10 max-w-[1400px] mx-auto pt-8 px-4 lg:px-10">

        {/* --- BACK BUTTON & BREADCRUMB --- */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <button 
            onClick={() => navigate(-1)}
            style={{ color: theme.primary }}
            className={`flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm transition-all duration-300 w-fit hover:shadow-lg hover:-translate-x-1`}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Back to Selection
          </button>

          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[2px] text-gray-400 bg-white/40 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/60 shadow-sm">
          <span className={`cursor-pointer transition-colors`} style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = theme.accent} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'} onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className={`cursor-pointer transition-colors`} style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = theme.accent} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'} onClick={() => navigate(`/products/${product.category?.categoryId}`)}>
             {product.category?.categoryId ? formatCategoryName(product.category.categoryId) : 'Collection'}
          </span>
          <span>/</span>
          <span style={{ color: theme.primary }} className="truncate max-w-[150px] md:max-w-none">{title}</span>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16" id="product-details">

          {/* LEFT — IMAGE GALLERY GRID */}
          <div className="space-y-4">
            {/* Image Grid - 2 columns like Myntra */}
            <div className="grid grid-cols-2 gap-4">
              {/* Generate 6 regular image boxes + 1 special 2x2 grid box */}
              {[0, 1, 2, 3, 4, 5, 6].map((index) => {
                // Last cell (index 6) will be a 2x2 sub-grid
                if (index === 6) {
                  return (
                    <div 
                      key={index}
                      className="bg-white/60 backdrop-blur-md border border-white/80 rounded-[24px] overflow-hidden shadow-[0_8px_24px_-8px_rgba(62,44,30,0.1)] p-2"
                      style={{
                        height: '300px',
                      }}
                    >
                      {/* 2x2 Sub-grid for product details */}
                      <div className="grid grid-cols-2 gap-2 h-full">
                        {[0, 1, 2, 3].map((subIndex) => (
                          <div 
                            key={subIndex}
                            className="relative bg-white/40 rounded-[16px] overflow-hidden border border-white/60 hover:border-white transition-all duration-300 group cursor-pointer"
                            onClick={() => {
                              setModalImageIndex(subIndex % images.length);
                              setIsModalOpen(true);
                            }}
                          >
                            <img
                              src={images[subIndex % images.length] || image}
                              alt={`${title} - Detail ${subIndex + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                // Regular image cells (0-5)
                return (
                  <div 
                    key={index}
                    className="bg-white/60 backdrop-blur-md border border-white/80 rounded-[24px] overflow-hidden shadow-[0_8px_24px_-8px_rgba(62,44,30,0.1)] hover:shadow-[0_12px_32px_-8px_rgba(62,44,30,0.15)] transition-all duration-300 relative group cursor-pointer"
                    style={{
                      // Make first image larger (spans 2 rows)
                      gridRow: index === 0 ? 'span 2' : 'span 1',
                      height: index === 0 ? 'auto' : '300px',
                      minHeight: index === 0 ? '600px' : '300px',
                    }}
                    onClick={() => {
                      setModalImageIndex(index % images.length);
                      setIsModalOpen(true);
                    }}
                  >
                    <img
                      src={images[index % images.length] || image}
                      alt={`${title} - View ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Image number indicator */}
                    <div 
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
                      style={{
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {index + 1}/7
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Image Modal Zoom */}
            <ImageModalZoom
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              images={[0, 1, 2, 3, 4, 5, 6].map(i => images[i % images.length] || image)}
              selectedIndex={modalImageIndex}
              productTitle={title}
              theme={theme}
            />
          </div>

          {/* RIGHT — INFO SECTION */}
          <div className="flex flex-col h-full lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-6 md:p-8 shadow-[0_8px_32px_0_rgba(62,44,30,0.05)] flex flex-col">
              
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      style={{ backgroundColor: `${theme.accent}1a`, color: theme.accent, borderColor: `${theme.accent}33` }}
                      className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border"
                    >
                      {product.brand || "Premium Brand"}
                    </span>
                    {product.inStock && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        In Stock
                      </span>
                    )}
                  </div>
                  
                  <h1 style={{ color: theme.primary }} className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
                    {title}
                  </h1>

                  <div className="flex items-center gap-4 mb-8 bg-white/40 px-4 py-2 rounded-2xl border border-white/60 w-fit">
                    <Rating value={product.averageRating || 0} precision={0.5} readOnly size="small" />
                    <span style={{ color: theme.primary }} className="text-xs font-black opacity-50 tracking-tighter uppercase tabular-nums">
                       {product.numRatings || 0} Global Reviews
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/80 p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
                     {/* Decorative shine hover */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                     
                     <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-5xl font-black text-[#3E2C1E] tracking-tighter tabular-nums">
                          ₹{product.sellingPrice}
                        </span>
                        <span className="text-xl text-gray-400 line-through font-medium opacity-60 tabular-nums">
                          ₹{product.mrpPrice}
                        </span>
                     </div>
                     <span className="text-[#0C831F] font-black text-xs uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        Savings of {product.discountPercent}% OFF
                     </span>
                  </div>

                  <div className="space-y-4">
                    <p style={{ color: theme.primary }} className="text-sm leading-relaxed opacity-70 font-medium italic">
                      "{description}"
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
                          <span style={{ color: theme.primary }} className="block text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Color Harmony</span>
                          <span style={{ color: theme.primary }} className="text-sm font-black">{product.color || "Classic"}</span>
                       </div>
                       <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
                          <span style={{ color: theme.primary }} className="block text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Size Selection</span>
                          <span style={{ color: theme.primary }} className="text-sm font-black">{product.sizes || "Standard"}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-12 flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  disableElevation
                  fullWidth
                  sx={{
                    bgcolor: theme.accent,
                    color: theme.selectionText,
                    fontWeight: 900,
                    textTransform: "none",
                    height: "64px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    letterSpacing: "-0.5px",
                    "&:hover": {
                      bgcolor: theme.primary,
                      color: theme.accent,
                      transform: "translateY(-4px)",
                      boxShadow: `0 20px 40px ${theme.primary}33`
                    },
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  Confirm & Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* --- BRAND STORY SECTION --- */}
        <div id="from-the-brand" className="mt-24">
          <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[48px] p-8 md:p-16 shadow-[0_20px_50px_rgba(62,44,30,0.05)] relative overflow-hidden">
            <div style={{ backgroundColor: `${theme.accent}0d` }} className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-48 -mt-48"></div>
            
            <div className="flex items-center gap-5 mb-10">
               <span style={{ backgroundColor: theme.accent, boxShadow: `0 0 15px ${theme.accent}4d` }} className="w-2.5 h-12 rounded-full"></span>
               <h2 style={{ color: theme.primary }} className="text-3xl md:text-4xl font-black tracking-tighter">
                 The <span style={{ color: theme.accent }}>{product?.brand || "Generic"}</span> Legacy
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
               <div className="md:col-span-2">
                 <p style={{ color: theme.primary }} className="leading-relaxed text-lg md:text-xl font-medium opacity-85 text-justify">
                   {product?.brandDescription || "Every product tells a story of craftsmanship and dedication. We believe in providing only the finest materials, curated specifically for those who appreciate the subtle art of quality and timeless design. Our commitment to excellence ensures that every piece you take home is more than just a purchase—it's a part of our heritage and your lifestyle."}
                 </p>
               </div>
                <div className="flex flex-col items-center justify-center text-center p-8 bg-white/60 rounded-[32px] border border-white shadow-[0_8px_30px_-5px_rgba(62,44,30,0.1)] hover:shadow-[0_15px_45px_-10px_rgba(62,44,30,0.15)] transition-shadow duration-300">
                   <div style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}33` }} className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4 border shadow-inner">🏆</div>
                   <h4 style={{ color: theme.primary }} className="font-extrabold uppercase text-xs tracking-[3px] mb-2">Quality Assurance</h4>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">100% Authentic Hand-picked selection</p>
               </div>
            </div>
          </div>
        </div>


        {/* --- REVIEWS ECOSYSTEM --- */}
        <div className="mt-24 space-y-10" id="reviews">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 px-4">
            <div className="flex items-center gap-5">
               <span style={{ backgroundColor: theme.accent, boxShadow: `0 0 15px ${theme.accent}4d` }} className="w-2.5 h-12 rounded-full"></span>
               <div>
                 <span style={{ color: theme.accent }} className="uppercase text-[10px] font-black tracking-[4px] block mb-2 opacity-80">Community feedback</span>
                 <h2 style={{ color: theme.primary }} className="text-3xl md:text-5xl font-black tracking-tighter">Voices of GSPL Mart</h2>
               </div>
            </div>
            <Button 
                variant="contained" 
                disableElevation
                onClick={() => setWriteReviewOpen(!writeReviewOpen)}
                sx={{
                  bgcolor: theme.primary,
                  color: "#FDFBF7",
                  height: "56px",
                  px: 6,
                  borderRadius: "18px",
                  fontWeight: 900,
                  textTransform: "none",
                  "&:hover": { bgcolor: theme.accent, color: theme.primary },
                  transition: "all 0.3s ease"
                }}
            >
              {writeReviewOpen ? "Close Form" : "Share Your Experience"}
            </Button>
          </div>

          {writeReviewOpen && (
            <div style={{ borderColor: `${theme.accent}4d`, boxShadow: `0 30px 60px ${theme.accent}14` }} className="p-10 md:p-14 bg-white/40 backdrop-blur-md rounded-[48px] space-y-8 animate-in fade-in zoom-in duration-500 border">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                 <div className="text-center md:text-left bg-white/60 p-8 rounded-[32px] border border-white shadow-sm min-w-[240px]">
                    <p style={{ color: theme.primary }} className="font-black uppercase tracking-widest text-xs mb-4">Select Rating</p>
                    <Rating 
                      value={ratingValue} 
                      onChange={(e, val) => setRatingValue(val)} 
                      size="large"
                      sx={{ scale: '1.4' }}
                    />
                 </div>
                 <div className="flex-1 w-full space-y-6">
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="DESCRIBE YOUR JOURNEY WITH THIS PRODUCT..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '24px',
                          bgcolor: 'white/60',
                          fontFamily: 'inherit',
                          fontSize: '15px',
                          fontWeight: 700,
                          '& fieldset': { borderColor: 'white/80' },
                          '&:hover fieldset': { borderColor: theme.accent },
                        }
                      }}
                    />
                    <div className="flex justify-end gap-3">
                      <Button 
                        onClick={() => setWriteReviewOpen(false)}
                        sx={{ color: theme.primary, fontWeight: 900, textTransform: 'none' }}
                      >
                        Maybe Later
                      </Button>
                      <Button 
                        variant="contained" 
                        disableElevation
                        onClick={handleSubmitReview}
                        sx={{
                            bgcolor: theme.accent,
                            color: theme.selectionText,
                            borderRadius: "15px",
                            fontWeight: 900,
                            px: 5,
                            textTransform: "none",
                            "&:hover": { bgcolor: theme.primary, color: theme.accent }
                        }}
                      >
                        Submit Experience
                      </Button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white/60 rounded-[40px] border border-white shadow-sm">
                <span className="text-5xl block mb-4 filter grayscale opacity-50">✍️</span>
                <p style={{ color: theme.primary }} className="font-bold text-xl opacity-60">Your review could be the first story shared here.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="h-full">
                  <ReviewCard
                    review={review}
                    isOwner={user?.id === review.user?.id}
                    onDelete={handleDeleteReview}
                  />
                </div>
              ))
            )}
          </div>
        </div>


        {/* --- SIMILAR VIBES SECTION --- */}
        <div id="similar-products" className="mt-20">
          <SimilarProduct
            categoryId={product.category?.categoryId}
            currentProductId={product.id}
            isGrocery={isGrocery}
          />
        </div>

      </div>

      <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProductDetails;
