import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchSimilarProducts,
} from "./productThunks";

interface ProductState {
  items: any[];
  page: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isLast: boolean;
  };
  selected: any | null;
  similarProducts: any[];
  searchResults: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  page: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    isLast: true,
  },
  selected: null,
  similarProducts: [],
  searchResults: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    // ---------- LIST PRODUCTS ----------
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;

      const data = action.payload;

      // products from Spring Page object
      state.items = data?.content ?? [];

      // normalize pagination object
      state.page = {
        pageNumber: data?.number ?? 0,
        pageSize: data?.size ?? 10,
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        isLast: data?.last ?? true,
      };
    });

    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ?? "Error loading products";
    });

    // ---------- PRODUCT DETAILS ----------
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
    });

    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ?? "Product not found";
    });

    // ---------- SEARCH ----------
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false;
      const data = action.payload;

      // Unify search results into the main list so ProductList can reuse it
      state.items = data?.content ?? [];
      state.searchResults = action.payload ?? []; // keep it if needed elsewhere

      state.page = {
        pageNumber: data?.number ?? 0,
        pageSize: data?.size ?? 10,
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        isLast: data?.last ?? true,
      };
    });

    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) ?? "Search failed";
    });

    // ---------- SIMILAR PRODUCTS ----------
    builder.addCase(fetchSimilarProducts.fulfilled, (state, action) => {
      state.similarProducts = action.payload?.content ?? [];
    });
  },
});

export const { clearSelected } = productSlice.actions;
export default productSlice.reducer;
