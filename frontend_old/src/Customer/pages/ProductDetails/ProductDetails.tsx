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


  // ---------- Loading ----------
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product…</p>
      </div>
    );
  }

  // ---------- Safe values ----------
  const image =
    product.images?.[0] ||
    "https://placehold.co/400x400?text=No+Image";

  const title = product.title ?? "Product";
  const description = product.description ?? "No description available";

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      <ProductStickyNavigation />

      <div className="max-w-[1200px] mx-auto pt-6 px-4 lg:px-10">

        {/* Breadcrumb */}
        <p className="text-xs text-gray-500 mb-6">
          Home / Products / <span className="text-gray-800">{title}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20" id="product-overview">

          {/* LEFT — IMAGE */}
          <div className="border border-gray-100 rounded-2xl p-6 flex items-center justify-center h-[420px]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* RIGHT — INFO */}
          <div className="space-y-6">

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {title}
            </h1>

            <div className="flex items-center gap-2">
              <Rating value={product.averageRating || 0} precision={0.5} readOnly />
              <span className="text-sm text-gray-500">({product.numRatings || 0} ratings)</span>
            </div>

            <Divider />

            <div>
              <p className="text-sm text-gray-700 mb-2">{description}</p>

              <div className="flex items-center gap-4 mt-3">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.sellingPrice}
                </span>

                <span className="text-gray-400 line-through">
                  ₹{product.mrpPrice}
                </span>

                <span className="text-green-600 font-semibold">
                  {product.discountPercent}% OFF
                </span>
              </div>
            </div>

            {/* Cart Buttons */}
            <div className="pt-2">
              <Button
                onClick={handleAddToCart}
                variant="contained"
                sx={{
                  backgroundColor: "#0C831F",
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Add to Cart
              </Button>
            </div>

            <Divider />

            <div id="product-details">
              <h3 className="font-bold text-lg mb-2">About this item</h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{description}</p>
                <p>Color: {product.color ?? "N/A"}</p>
                <p>Sizes: {product.sizes ?? "N/A"}</p>
                <p>Brand: {product.brand || "Generic"}</p>
              </div>
            </div>

          </div>
        </div>

        {/* From the Brand - Placeholder Section */}
        <Divider sx={{ my: 10 }} />
        <div id="from-the-brand" className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            From the Brand: <span className="text-primary-color">{product?.brand || "Generic"}</span>
          </h2>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-600 leading-relaxed text-lg">
              {product?.brandDescription || "No brand story available for this product yet."}
            </p>
          </div>
        </div>


        {/* REVIEWS SECTION */}
        <Divider sx={{ my: 10 }} />
        <div className="space-y-5" id="reviews">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button variant="outlined" onClick={() => setWriteReviewOpen(!writeReviewOpen)}>Write a Review</Button>
          </div>

          {writeReviewOpen && (
            <div className="p-5 border rounded-md space-y-4">
              <p className="font-semibold">Rate this product:</p>
              <Rating value={ratingValue} onChange={(e, val) => setRatingValue(val)} />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setWriteReviewOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmitReview}>Submit Review</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id}>
                  <ReviewCard
                    review={review}
                    isOwner={user?.id === review.user?.id}
                    onDelete={handleDeleteReview}
                  />
                  <Divider sx={{ my: 2 }} />
                </div>
              ))
            )}
          </div>
        </div>


        {/* Similar Products */}
        <div id="similar-products">
          <Divider sx={{ my: 10 }} />
          {product.category && (
            <SimilarProduct
              categoryId={product.category.categoryId}
              currentProductId={product.id}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
