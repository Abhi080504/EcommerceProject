import { createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchUserOrders, fetchOrderById } from "./orderThunks";

interface OrderState {
    orders: any[];
    order: any | null;
    loading: boolean;
    error: any | null;
    paymentLink: string | null;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    paymentLink: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearOrderState: (state) => {
            state.order = null;
            state.paymentLink = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // --- CREATE ORDER ---
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentLink = action.payload.payment_link_url;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --- FETCH USER ORDERS ---
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --- FETCH ORDER BY ID ---
        builder
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
