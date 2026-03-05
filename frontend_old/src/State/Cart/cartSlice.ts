import { createSlice } from "@reduxjs/toolkit";
import { fetchUserCart, addItemToCart, removeCartItem, updateCartItem, applyCoupon } from "./cartThunks";

interface CartState {
    cart: any | null;
    loading: boolean;
    error: any | null;
    cartItems: any[];
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
    cartItems: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState: (state) => {
            // Optional: Reset state manually if needed
            state.cart = null;
            state.cartItems = [];
        }
    },
    extraReducers: (builder) => {
        // --- FETCH CART ---
        builder
            .addCase(fetchUserCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                state.cartItems = action.payload.cartItems;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --- ADD ITEM ---
        builder
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                // Depending on API response, either re-fetch cart or push item
                // Typically Backend 'addCartItem' returns the Item.
                // But to keep totals in sync, we might need to re-fetch or trust local update.
                // For now, let's assume we re-fetch effectively or just add to list. 
                // Our backend returns the ADDED ITEM.
                state.cartItems.push(action.payload);
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --- REMOVE ITEM ---
        builder
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                // Note: Total price won't update automatically here unless we recalculate locally or re-fetch cart.
                // Ideally, we should re-fetch cart after modifying.
                // For simplicity, we assume the component might trigger refetch or we ignore total price drift for a moment.
                // BUT logic suggests we should update `cart` object too if possible.
            });

        // --- UPDATE ITEM ---
        builder
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cartItems.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.cartItems[index] = action.payload;
                }
            });

        // --- APPLY COUPON ---
        builder
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                state.cartItems = action.payload.cartItems; // Sync items if implementation returns full cart
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
