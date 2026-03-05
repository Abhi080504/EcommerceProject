import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchCoupons = createAsyncThunk(
    "coupon/fetchCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/coupons/admin/all");
            console.log("all coupons", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCoupon = createAsyncThunk(
    "coupon/createCoupon",
    async (couponData: any, { rejectWithValue }) => {
        try {
            const response = await api.post("/coupons/admin/create", couponData);
            console.log("created coupon", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    "coupon/deleteCoupon",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/coupons/admin/delete/${id}`);
            console.log("deleted coupon", id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

interface CouponState {
    coupons: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CouponState = {
    coupons: [],
    loading: false,
    error: null,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.coupons.push(action.payload);
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter((coupon) => coupon.id !== action.payload);
            });
    },
});

export default couponSlice.reducer;
