import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface Seller {
    id: number;
    sellerName: string;
    email: string;
    mobile: string;
    gstin: string;
    role: string;
    accountStatus: string;
    bussinessDetails: {
        bussinessName: string;
    }
}

interface SellerState {
    sellers: Seller[];
    loading: boolean;
    error: string | null;
}

const initialState: SellerState = {
    sellers: [],
    loading: false,
    error: null,
};

// Fetch All Sellers
export const fetchSellers = createAsyncThunk<Seller[], { status?: string }>(
    "seller/fetchSellers",
    async ({ status }, { rejectWithValue }) => {
        try {
            const res = await api.get("/sellers", {
                params: { status }
            });
            return res.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch sellers");
        }
    }
);

// Update Seller Status
export const updateSellerStatus = createAsyncThunk<
    Seller,
    { id: number; status: string }
>(
    "seller/updateSellerStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/seller/${id}/status/${status}`);
            return res.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update status");
        }
    }
);


const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Sellers
        builder.addCase(fetchSellers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellers.fulfilled, (state, action) => {
            state.sellers = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchSellers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Status
        builder.addCase(updateSellerStatus.fulfilled, (state, action) => {
            const index = state.sellers.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.sellers[index] = action.payload;
            }
        });
    },
});

export default sellerSlice.reducer;
