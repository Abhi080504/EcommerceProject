import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSellerTransactions as fetchSellerTransactionsApi } from "./transactionApi";

interface TransactionState {
    transactions: any[];
    loading: boolean;
    error: any;
}

const initialState: TransactionState = {
    transactions: [],
    loading: false,
    error: null,
};

export const fetchSellerTransactions = createAsyncThunk(
    "transaction/fetchSellerTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchSellerTransactionsApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload || [];
            })
            .addCase(fetchSellerTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default transactionSlice.reducer;
