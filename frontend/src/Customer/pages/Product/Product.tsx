import React, { useState, useEffect } from "react";
import { Button, Divider } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SimilarProduct from "./SimilarProduct";

import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { fetchProductById } from "../../../State/product/productThunks";
import { addItemToCart } from "../../../State/Cart/cartThunks";

const Product = () => {
  /* ===============================
     ROUTE + REDUX
  ================================ */
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const { selected: product, loading } = useAppSelector(
    (state) => state.products
  );

  /* ===============================
     FETCH PRODUCT
  ================================ */
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  /* ===============================
     LOCAL UI STATE
  ================================ */
  const [quantity, setQuantity] = useState(0);

  /* ===============================
     LOADING STATE
  ================================ */
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading product...
      </div>
    );
  }

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400";

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto pt-6 px-4 lg:px-10">

        {/* ===============================
            BREADCRUMB
        ================================ */}
        <p className="text-xs text-gray-500 mb-6">
          Home / {product.category?.categoryId || "Category"} /{" "}
          <span className="text-gray-800">{product.title}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ===============================
              LEFT — IMAGE
          ================================ */}
          <div className="border border-gray-100 rounded-2xl p-6 flex items-center justify-center bg-white h-[400px] lg:h-[500px] relative overflow-hidden">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 text-xs text-gray-400">
              Hover to zoom
            </div>
          </div>

          {/* ===============================
              RIGHT — DETAILS
          ================================ */}
          <div className="space-y-6">

            {/* TITLE */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <div className="bg-[#F8F8F8] w-fit px-2 py-1 rounded flex items-center gap-1.5">
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <span className="text-[10px] font-bold text-gray-700 uppercase">
                  Fast Delivery
                </span>
              </div>
            </div>

            <Divider />

            {/* PRICE */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.sellingPrice}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrpPrice}
                </span>

                <span className="text-xs text-white bg-green-600 px-2 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              </div>
            </div>

            {/* ADD TO CART */}
            <div className="pt-4">
              {quantity === 0 ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    const req = {
                      productId: product.id,
                      size: product.sizes?.[0]?.name || "M",
                      quantity: 1,
                      product: product // 🔹 Pass product for guest cart
                    };
                    dispatch(addItemToCart(req));
                    setQuantity(1);
                  }}
                  sx={{
                    backgroundColor: "#0C831F",
                    fontWeight: "bold",
                    padding: "10px 40px",
                    textTransform: "none",
                    fontSize: "16px",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#096b19" },
                  }}
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center gap-4 bg-[#0C831F] w-fit px-4 py-2 rounded-lg text-white">
                  <div onClick={() => setQuantity((q) => q - 1)} className="cursor-pointer">
                    <Remove />
                  </div>
                  <span className="font-bold text-lg w-6 text-center">
                    {quantity}
                  </span>
                  <div onClick={() => setQuantity((q) => q + 1)} className="cursor-pointer">
                    <Add />
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="pt-6">
              <h3 className="font-bold text-lg mb-2">Product Details</h3>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-semibold text-gray-800">Category:</span>{" "}
                  {product.category?.categoryId}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Color:</span>{" "}
                  {product.color || "—"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Description:</span>{" "}
                  {product.description}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ===============================
            SIMILAR PRODUCTS
        ================================ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
          <SimilarProduct
            categoryId={product.category?.categoryId}
            currentProductId={product.id}
          />
        </div>

      </div>
    </div>
  );
};

export default Product;
