import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface Review {
    id: number;
    reviewText: string;
    rating: number;
    user: {
        id: number;
        fullName: string;
        profilePicture?: string;
    };
    productImages: string[];
    createdAt: string;
    productId?: number;
}

interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
};

export const fetchReviewsByProductId = createAsyncThunk(
    "review/fetchReviewsByProductId",
    async ({ productId }: { productId: number }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${productId}/reviews`);
            return response.data; // backend returns Page<Review> or List<Review>? 
            // Controller: ApiResponse<Page<Review>>. response.data is the ApiResponse.
            // We probably need response.data.data.content if it's a Page, or response.data.data if list.
            // Controller says: `reviews` is Page<Review>. ApiResponse body is `reviews`.
            // So response.data is ApiResponse. response.data.data is Page. response.data.data.content is List.
            // Let's assume standard response structure. 
            // Using 'any' for safety for now until verified.
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
        }
    }
);

export const createReview = createAsyncThunk(
    "review/createReview",
    async (
        reqData: { productId: number; reviewText: string; reviewRating: number; productImages: string[] },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(`/products/${reqData.productId}/reviews`, reqData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create review");
        }
    }
);

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (reviewId: number, { rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            return reviewId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete review");
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchReviewsByProductId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
                state.loading = false;
                // Adjust based on actual API response structure. 
                // If API returns Page, we usually want .content
                // For now, let's assume specific handling or loose typing if structure varies.
                // Controller returns: new ApiResponse<>(true, "Reviews Retrieved", reviews, HttpStatus.OK.value());
                // reviews is Page<Review>.
                const payload = action.payload as any;
                if (payload.data && Array.isArray(payload.data.content)) {
                    state.reviews = payload.data.content;
                } else if (Array.isArray(payload)) {
                    state.reviews = payload;
                } else if (payload.content && Array.isArray(payload.content)) {
                    state.reviews = payload.content;
                } else {
                    state.reviews = [];
                }
            })
            .addCase(fetchReviewsByProductId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                // Controller returns ApiResponse<Review>. payload.data is Review.
                const payload = action.payload as any;
                if (payload.data) {
                    state.reviews.unshift(payload.data);
                }
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete
        builder
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter((r) => r.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default reviewSlice.reducer;
