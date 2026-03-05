
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";

import { clearSelected } from "../../../State/product/productSlice";
import { fetchProductById } from "../../../State/product/productThunks";
import { addItemToCart } from "../../../State/Cart/cartThunks";
import { fetchReviewsByProductId, createReview, deleteReview } from "../../../State/review/reviewSlice";

import { Button, Rating, TextField } from "@mui/material";

import { useToast } from "../../../context/ToastContext";
import SimilarProduct from "./SimilarProduct";
import ReviewCard from "../Review/ReviewCard";
import ProductStickyNavigation from "./ProductStickyNavigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const GroceryProductDetails = () => {

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ---------- Load product ----------
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
      dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    }
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    const req = {
      productId: product.id,
      size: product.sizes || "Standard",
      quantity: 1,
      product: product
    };
    try {
      await dispatch(addItemToCart(req)).unwrap();
      showToast("Fresh item added to cart!", "success");
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  // ---------- GROCERY THEME ----------
  const theme = {
    bg: "#F1F8E9", // Light Green Background
    primary: "#1B5E20", // Dark Green Text
    accent: "#FFB300", // Amber Accent
    secondary: "#4CAF50", // Medium Green
    lightGreen: "#DCEDC8", // Pale Green
    white: "#FFFFFF",
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F8E9]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-16 h-16 rounded-full bg-[#1B5E20] opacity-20"></div>
           <p className="text-[#1B5E20] font-bold">Fetching fresh produce...</p>
        </div>
      </div>
    );
  }

  // ---------- Safe values ----------
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://via.placeholder.com/400x400?text=Fresh+Product"];
  
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div style={{ backgroundColor: theme.bg }} className="relative min-h-screen font-sans pb-20 selection:bg-[#1B5E20] selection:text-white">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#DCEDC8]/30 to-transparent pointer-events-none"></div>
      <div className="fixed -top-20 -right-20 w-[400px] h-[400px] bg-[#A5D6A7] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <ProductStickyNavigation isGrocery={true} />

      <div className="relative z-10 max-w-[1280px] mx-auto pt-6 px-4 lg:px-8">
        
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
          <span className={`cursor-pointer transition-colors`} style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = theme.accent} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'} onClick={() => navigate(-1)}>
             Groceries
          </span>
          <span>/</span>
          <span style={{ color: theme.primary }} className="truncate max-w-[150px] md:max-w-none">{product.title}</span>
        </div>
      </div>

        <div id="product-details" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            
            {/* LEFT: IMAGE GALLERY (Simple & Focused) */}
            <div className="space-y-4">
                <div className="bg-white rounded-[32px] p-8 border border-[#C8E6C9] shadow-sm flex items-center justify-center relative overflow-hidden group h-[400px] md:h-[500px]">
                    <img 
                        src={currentImage} 
                        alt={product.title} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
                    />
                    <div className="absolute top-4 right-4 bg-[#FFB300] text-[#1B5E20] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                        Fresh
                    </div>
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img: string, idx: number) => (
                            <div 
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`
                                    min-w-[80px] h-[80px] rounded-xl border-2 cursor-pointer bg-white p-2
                                    transition-all duration-300
                                    ${selectedImageIndex === idx ? 'border-[#1B5E20] scale-105 shadow-md' : 'border-transparent hover:border-[#1B5E20]/50'}
                                `}
                            >
                                <img src={img} alt="" className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: PRODUCT INFO (Clean & Structured) */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#1B5E20] leading-tight mb-2">
                        {product.title}
                    </h1>
                    <p className="text-[#33691E] text-sm font-medium opacity-80">
                        {product.brand ? `By ${product.brand}` : "Farm Fresh Quality"}
                    </p>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center gap-6 border-b border-[#C8E6C9] pb-6">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-[#1B5E20]">₹{product.sellingPrice}</span>
                            <span className="text-lg text-gray-400 line-through font-medium">₹{product.mrpPrice}</span>
                        </div>
                        <span className="text-[#2E7D32] text-xs font-bold bg-[#DCEDC8] px-2 py-0.5 rounded">
                            {product.discountPercent}% OFF
                        </span>
                    </div>
                    <div className="h-10 w-px bg-[#C8E6C9]"></div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <Rating value={product.averageRating || 4.5} precision={0.5} readOnly size="small" />
                            <span className="text-xs font-bold text-[#1B5E20]">{product.averageRating || 4.5}</span>
                        </div>
                        <span className="text-[10px] text-[#33691E] font-medium">{product.numRatings || 120} Reviews</span>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="space-y-4">
                    <p className="text-[#33691E] leading-relaxed text-sm md:text-base">
                        {product.description || "Freshly sourced produce, carefully selected to ensure the highest quality for your kitchen. Rich in nutrients and flavor, perfect for daily consumption."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                        <div className="bg-white/50 p-3 rounded-lg border border-[#C8E6C9]">
                             <span className="block text-[10px] text-[#558B2F] font-bold uppercase">Storage</span>
                             <span className="font-bold text-[#1B5E20]">Cool & dry place</span>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg border border-[#C8E6C9]">
                             <span className="block text-[10px] text-[#558B2F] font-bold uppercase">Shelf Life</span>
                             <span className="font-bold text-[#1B5E20]">3-5 Days</span>
                        </div>
                    </div>
                    

                </div>

                {/* Benefits */}
                <div className="flex gap-4 text-[#1B5E20] text-xs font-bold">
                    <div className="flex items-center gap-1.5 bg-[#DCEDC8]/50 px-3 py-1.5 rounded-full">
                        <LocalShippingIcon sx={{ fontSize: 16 }} /> Fast Delivery
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#DCEDC8]/50 px-3 py-1.5 rounded-full">
                        <VerifiedUserIcon sx={{ fontSize: 16 }} /> Quality Check
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4">
                    <Button 
                        onClick={handleAddToCart}
                        variant="contained"
                        fullWidth
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                            bgcolor: '#1B5E20',
                            color: 'white',
                            py: 2,
                            borderRadius: '16px',
                            fontWeight: 900,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                                bgcolor: '#2E7D32',
                                boxShadow: '0 10px 20px rgba(27,94,32,0.2)'
                            }
                        }}
                    >
                        Add to Basket — ₹{product.sellingPrice}
                    </Button>
                </div>
            </div>
        </div>

        {/* --- REVIEWS ECOSYSTEM --- */}
        <div className="mt-20 space-y-10" id="reviews">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 px-4">
            <div className="flex items-center gap-5">
               <span style={{ backgroundColor: theme.accent, boxShadow: `0 0 15px ${theme.accent}4d` }} className="w-2.5 h-12 rounded-full"></span>
               <div>
                 <span style={{ color: theme.accent }} className="uppercase text-[10px] font-black tracking-[4px] block mb-2 opacity-80">Community feedback</span>
                 <h2 style={{ color: theme.primary }} className="text-3xl md:text-5xl font-black tracking-tighter">Voices of Freshness</h2>
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
                            color: theme.white,
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
              <div className="col-span-full py-20 text-center bg-[#E8F5E9] rounded-[40px] border border-[#C8E6C9] shadow-sm">
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

        {/* Similar Products (Recycled) */}
        <div id="similar-products" className="mt-20">
             <SimilarProduct 
                categoryId={product.category?.categoryId} 
                currentProductId={product.id}
                isGrocery={true}
            />
        </div>

      </div>
    </div>
  );
};

export default GroceryProductDetails;
