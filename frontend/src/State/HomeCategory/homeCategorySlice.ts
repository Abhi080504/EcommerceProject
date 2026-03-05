import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchHomeCategories = createAsyncThunk(
    "homeCategory/fetchHomeCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/home-category");
            console.log("home categories", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateHomeCategory = createAsyncThunk(
    "homeCategory/updateHomeCategory",
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/home-category/${id}`, data);
            console.log("updated home category", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

interface HomeCategoryState {
    categories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: HomeCategoryState = {
    categories: [],
    loading: false,
    error: null,
};

const homeCategorySlice = createSlice({
    name: "homeCategory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHomeCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchHomeCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateHomeCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            });
    },
});

export default homeCategorySlice.reducer;
