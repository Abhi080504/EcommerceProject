import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", { params });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (productId: string | number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${productId}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Product not found");
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await api.get("/products/search", {
        params: { query },
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilar",
  async (
    {
      categoryId,
      subCategoryId,
    }: { categoryId?: string; subCategoryId?: string },
    { rejectWithValue }
  ) => {
    try {
      const params: any = { pageNumber: 0, pageSize: 6, sort: "newest" };
      if (categoryId) params.category = categoryId;
      // You can add more logic here if you want to use subCategoryId for stricter matching

      const res = await api.get("/products", { params });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load similar products");
    }
  }
);
