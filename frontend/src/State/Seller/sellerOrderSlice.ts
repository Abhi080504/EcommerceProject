import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSellerOrders as fetchSellerOrdersApi, updateSellerOrderStatus as updateSellerOrderStatusApi } from "./sellerOrderApi";

interface SellerOrderState {
    orders: any[];
    loading: boolean;
    error: any;
}

const initialState: SellerOrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const fetchSellerOrders = createAsyncThunk(
    "sellerOrder/fetchSellerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchSellerOrdersApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updateSellerOrderStatus = createAsyncThunk(
    "sellerOrder/updateSellerOrderStatus",
    async (req: { orderId: number, status: string }, { rejectWithValue }) => {
        try {
            const response = await updateSellerOrderStatusApi(req);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const sellerOrderSlice = createSlice({
    name: "sellerOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload?.content || action.payload || [];
            })
            .addCase(fetchSellerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSellerOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSellerOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                const index = state.orders.findIndex((o) => o.id === updatedOrder.id);
                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                }
            })
            .addCase(updateSellerOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default sellerOrderSlice.reducer;
