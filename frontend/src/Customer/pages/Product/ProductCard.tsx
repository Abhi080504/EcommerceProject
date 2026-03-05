import { Button } from "@mui/material";
import React, { useCallback } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../State/hooks";
import { addItemToCart } from "../../../State/Cart/cartThunks";
import { useToast } from "../../../context/ToastContext";

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  product?: any;
};

const ProductCard = ({
  id,
  title,
  price,
  mrp,
  discount,
  image,
  product,
}: ProductCardProps) => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { showToast } = useToast();

  const handleOpenDetails = useCallback(() => {
    // Save current scroll position for Home page restoration
    // Find the closest section ID if on Home page
    const sections = document.querySelectorAll('[id^="section-"]');
    const scrollY = window.scrollY;
    
    let closestSection = null;
    let closestDistance = Infinity;
    
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const distance = Math.abs(scrollY - sectionTop);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section.id;
      }
    });
    
    if (closestSection) {
      sessionStorage.setItem('last_home_section', closestSection);
    }
    
    navigate(`/product/${id}`);
  }, [id, navigate]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    const req = {
      productId: id,
      size: product?.sizes?.[0]?.name || "M",
      quantity: 1,
      product: product // 🔹 Pass product for guest cart
    };
    try {
      await dispatch(addItemToCart(req)).unwrap();
      showToast("Item added to cart", "success");
    } catch (error) {
      console.error("Failed to add to cart", error);
      showToast("Failed to add to cart", "error");
    }
  }, [id, product, dispatch, showToast]);



  return (
    <div
      className="bg-white/60 border border-[#3E2C1E]/5 rounded-[24px] p-5 cursor-pointer shadow-[0_4px_15px_-5px_rgba(62,44,30,0.06)] hover:shadow-[0_10px_25px_-8px_rgba(62,44,30,0.12)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between relative group overflow-hidden"
      onClick={handleOpenDetails}
    >
      {/* Delivery Badge */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-full px-2.5 py-1 flex items-center gap-1.5 z-10 shadow-sm border border-gray-100">
        <AccessTimeIcon sx={{ fontSize: 13, color: "#F9B233" }} />
        <span className="text-[10px] font-black text-[#3E2C1E] tracking-tight">8 MINS</span>
      </div>

      {/* Product Image Wrapper */}
      <div className="w-full h-[180px] bg-white/50 rounded-2xl flex justify-center items-center mb-5 p-4 transition-colors duration-300 group-hover:bg-white/80 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Simplified glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F9B233]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-extrabold text-[#3E2C1E] text-[15px] leading-tight line-clamp-2 min-h-[40px] group-hover:text-[#F9B233] transition-colors duration-300">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#3E2C1E]/5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#3E2C1E] font-black text-lg">
                ₹{price}
              </span>
              <span className="text-gray-400 text-xs line-through font-medium">
                ₹{mrp}
              </span>
            </div>

            {discount !== 0 && (
              <span className="text-[11px] text-[#0C831F] font-black uppercase tracking-wider">
                {discount}% OFF
              </span>
            )}
          </div>

          <Button
            variant="contained"
            onClick={handleAddToCart}
            disableElevation
            sx={{
              bgcolor: "#F9B233",
              color: "#3E2C1E",
              textTransform: "none",
              fontWeight: 900,
              minWidth: "75px",
              height: "36px",
              fontSize: "13px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(249,178,51,0.2)",
              "&:hover": {
                bgcolor: "#3E2C1E",
                color: "#F9B233",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(62,44,30,0.2)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            ADD
          </Button>
        </div>
      </div>
      
      {/* Simplified Decorative Corner Element */}
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#F9B233]/5 rounded-full blur-lg group-hover:bg-[#F9B233]/10 transition-all duration-500"></div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(ProductCard);
