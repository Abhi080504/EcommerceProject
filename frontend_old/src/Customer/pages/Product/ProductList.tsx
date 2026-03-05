import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { fetchProducts, searchProducts } from "../../../State/product/productThunks";
import ProductCard from "./ProductCard";
import { GridSkeleton } from "../../../components/Shared/Skeletons";

const ProductList = () => {

  const dispatch = useAppDispatch();
  const location = useLocation();
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

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">

        <h1 className="text-2xl font-bold mb-6">
          {category ? `${category} Products` : "All Products"}
        </h1>

        {/* ---------- LOADING ---------- */}
        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <>
            {/* ---------- EMPTY STATE ---------- */}
            {items.length === 0 && (
              <p className="text-gray-500">No products found for this category.</p>
            )}

            {/* ---------- PRODUCT GRID ---------- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title ?? "Untitled Product"}
                  price={product.sellingPrice}
                  mrp={product.mrpPrice}
                  discount={product.discountPercent}
                  image={
                    product.images?.[0] ||
                    "https://placehold.co/300x300?text=No+Image"
                  }
                  product={product}
                />

              ))}

            </div>
          </>
        )}

        {/* ---------- PAGINATION ---------- */}
        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            onClick={handlePrev}
            disabled={page.pageNumber === 0}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page.pageNumber + 1} of {page.totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={page.isLast}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductList;
