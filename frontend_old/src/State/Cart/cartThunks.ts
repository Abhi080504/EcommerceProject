import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCart as fetchCartAPI, addItemToCart as addItemAPI, removeCartItem as removeItemAPI, updateCartItem as updateItemAPI } from "./cartApi";
import { api } from "../../config/Api";

// --- HELPER: Calculate Totals ---
const calculateTotals = (cartItems: any[]) => {
    let totalItem = 0;
    let totalSellingPrice = 0;
    let totalMrpPrice = 0;
    let discount = 0;

    cartItems.forEach(item => {
        totalItem += item.quantity;
        totalSellingPrice += item.sellingPrice * item.quantity;
        totalMrpPrice += item.mrpPrice * item.quantity;
    });

    discount = totalMrpPrice - totalSellingPrice;

    return {
        cartItems,
        totalItem,
        totalSellingPrice,
        totalMrpPrice,
        discount,
        id: 0 // Mock ID for guest cart
    };
};

export const fetchUserCart = createAsyncThunk(
    "cart/fetchUserCart",
    async (_, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const response = await fetchCartAPI();
                return response;
            } else {
                // GUEST MODE
                const guestCartJson = localStorage.getItem("guest_cart");
                const guestCart = guestCartJson ? JSON.parse(guestCartJson) : { cartItems: [] };
                return calculateTotals(guestCart.cartItems || []);
            }
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

// Updated signature: accepts optional 'product' for guest mode
export const addItemToCart = createAsyncThunk(
    "cart/addItemToCart",
    async (req: { productId: number; size: string; quantity: number; product?: any }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const response = await addItemAPI(req);
                return response;
            } else {
                // GUEST MODE
                if (!req.product) {
                    throw new Error("Product details required for guest cart");
                }

                const guestCartJson = localStorage.getItem("guest_cart");
                const guestCart = guestCartJson ? JSON.parse(guestCartJson) : { cartItems: [] };
                let items = guestCart.cartItems || [];

                // Check if item exists
                const existingIndex = items.findIndex((i: any) => i.product.id === req.productId && i.size === req.size);

                if (existingIndex > -1) {
                    // Update quantity
                    items[existingIndex].quantity += req.quantity;
                } else {
                    // Add new item
                    const newItem = {
                        id: Date.now(), // Local temp ID
                        product: req.product,
                        size: req.size,
                        quantity: req.quantity,
                        sellingPrice: req.product.sellingPrice,
                        mrpPrice: req.product.mrpPrice,
                        userId: null
                    };
                    items.push(newItem);
                }

                // Save
                const updatedCart = calculateTotals(items);
                localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

                // Return the *Added Item* (to match backend behavior for reducer)
                // However, updatedCart totals won't sync unless we return the whole cart or trigger refetch.
                // Reducer basically pushes `action.payload`.
                // Ideally, we should update the whole cart in state.
                // But for now, returning the item satisfies the existing reducer structure.
                // The logical item returned:
                return existingIndex > -1 ? items[existingIndex] : items[items.length - 1];
            }
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (cartItemId: number, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                await removeItemAPI(cartItemId);
                return cartItemId;
            } else {
                // GUEST MODE
                const guestCartJson = localStorage.getItem("guest_cart");
                if (guestCartJson) {
                    let guestCart = JSON.parse(guestCartJson);
                    let items = guestCart.cartItems || [];
                    items = items.filter((item: any) => item.id !== cartItemId);

                    const updatedCart = calculateTotals(items);
                    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
                }
                return cartItemId;
            }
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async (req: { cartItemId: number; data: { quantity: number } }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const response = await updateItemAPI(req);
                return response;
            } else {
                // GUEST MODE
                const guestCartJson = localStorage.getItem("guest_cart");
                if (guestCartJson) {
                    let guestCart = JSON.parse(guestCartJson);
                    let items = guestCart.cartItems || [];
                    const index = items.findIndex((item: any) => item.id === req.cartItemId);

                    if (index > -1) {
                        items[index].quantity = req.data.quantity;
                        const updatedCart = calculateTotals(items);
                        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
                        return items[index];
                    }
                }
                return rejectWithValue("Item not found");
            }
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async (req: { apply: string; code: string; orderValue: number }, { rejectWithValue }) => {
        try {
            // Coupons usually require backend validation.
            // For guest, we might skip or fail.
            const response = await import("./cartApi").then((api) => api.applyCoupon(req));
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);
