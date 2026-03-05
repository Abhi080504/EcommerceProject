import { Button } from "@mui/material";
import React from "react";
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

  const handleOpenDetails = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
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
  };



  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between relative group"
      onClick={handleOpenDetails}
    >
      {/* Delivery Badge */}
      <div className="absolute top-3 left-3 bg-[#F8F8F8] rounded px-1.5 py-0.5 flex items-center gap-1 z-10">
        <AccessTimeIcon sx={{ fontSize: 10, color: "black" }} />
        <span className="text-[9px] font-bold text-gray-900">8 MINS</span>
      </div>

      {/* Image */}
      <div className="w-full h-[140px] flex justify-center items-center mb-2">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-900 text-[14px] leading-tight line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex flex-col">
            <span className="text-gray-900 font-semibold text-sm">
              ₹{price}
            </span>

            <span className="text-gray-400 text-xs line-through">
              ₹{mrp}
            </span>

            {discount !== 0 && (
              <span className="text-[11px] text-green-600 font-semibold">
                {discount}% OFF
              </span>
            )}
          </div>

          <Button
            variant="outlined"
            onClick={handleAddToCart}
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

export default ProductCard;
