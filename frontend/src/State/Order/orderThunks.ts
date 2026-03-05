import { createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder as createOrderAPI, fetchUserOrders as fetchOrdersAPI, fetchOrderById as fetchOrderAPI } from "./orderApi";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (req: { address: any; paymentMethod: "RAZORPAY" | "STRIPE" | "COD" }, { rejectWithValue }) => {
        try {
            const response = await createOrderAPI(req);
            return response; // PaymentLinkResponse
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    "order/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchOrdersAPI();
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    "order/fetchOrderById",
    async (orderId: number, { rejectWithValue }) => {
        try {
            // Note: The controller returns just the Order object
            const response = await fetchOrderAPI(orderId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);
