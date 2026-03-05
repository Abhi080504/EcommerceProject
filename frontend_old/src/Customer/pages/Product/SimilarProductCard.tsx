import { Button } from "@mui/material";
import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";

/* ============================
   PROPS
============================ */
import { useAppDispatch } from "../../../State/hooks";
import { addItemToCart } from "../../../State/Cart/cartThunks";

interface SimilarProductCardProps {
  product: any;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between relative"
    >
      {/* DELIVERY TIME */}
      <div className="absolute top-3 left-3 bg-[#F8F8F8] rounded px-1.5 py-0.5 flex items-center gap-1 z-10">
        <AccessTimeIcon sx={{ fontSize: 10, color: "black" }} />
        <span className="text-[9px] font-bold text-gray-900">8 MINS</span>
      </div>

      {/* IMAGE */}
      <div className="w-full h-[140px] flex justify-center items-center mb-2">
        <img
          src={
            product?.images?.[0] ||
            "https://placehold.co/200?text=No+Image"
          }
          alt={product?.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-900 text-[14px] leading-tight line-clamp-2">
          {product?.title}
        </h3>

        {/* Optional size / unit */}
        <p className="text-gray-500 text-xs">
          {product?.sizes || "—"}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex flex-col">
            <span className="text-gray-900 font-semibold text-sm">
              ₹{product?.sellingPrice}
            </span>

            {product?.mrpPrice && (
              <span className="text-gray-400 text-xs line-through">
                ₹{product.mrpPrice}
              </span>
            )}
          </div>


          {/* ADD BUTTON */}
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              const req = {
                productId: product.id,
                size: product.sizes?.[0]?.name || "M",
                quantity: 1,
                product: product // 🔹 Pass product for guest cart
              };
              dispatch(addItemToCart(req));
              // Optional: Provide feedback or navigate
              // navigate("/cart"); 
            }}
            sx={{
              color: "#0C831F",
              borderColor: "#0C831F",
              backgroundColor: "#F7FFF9",
              textTransform: "none",
              fontWeight: "bold",
              minWidth: "65px",
              height: "32px",
              fontSize: "13px",
              borderWidth: "1px",
              "&:hover": {
                backgroundColor: "#0C831F",
                color: "white",
                borderWidth: "1px",
              },
            }}
          >
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
