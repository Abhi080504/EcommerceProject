import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchDeals = createAsyncThunk(
    "deal/fetchDeals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/deals");
            console.log("all deals", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createDeal = createAsyncThunk(
    "deal/createDeal",
    async (dealData: any, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/deals", dealData);
            console.log("created deal", response.data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteDeal = createAsyncThunk(
    "deal/deleteDeal",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/deals/${id}`);
            console.log("deleted deal", id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

interface DealState {
    deals: any[];
    loading: boolean;
    error: string | null;
}

const initialState: DealState = {
    deals: [],
    loading: false,
    error: null,
};

const dealSlice = createSlice({
    name: "deal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = action.payload;
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.deals.push(action.payload);
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.deals = state.deals.filter((deal) => deal.id !== action.payload);
            });
    },
});

export default dealSlice.reducer;
