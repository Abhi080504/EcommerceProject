import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

interface CreateReviewReq {
    productId: number;
    reviewText: string;
    reviewRating: number;
    productImages: string[];
}

interface ReviewState {
    reviews: any[];
    item: any | null;
    loading: boolean;
    error: string | null;
    page: {
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalElements: number;
        isLast: boolean;
    };
}

const initialState: ReviewState = {
    reviews: [],
    item: null,
    loading: false,
    error: null,
    page: {
        pageNumber: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
        isLast: true,
    },
};

export const fetchReviewsByProductId = createAsyncThunk(
    "reviews/fetchByProductId",
    async (
        {
            productId,
            pageNumber = 0,
            pageSize = 10,
        }: { productId: number; pageNumber?: number; pageSize?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.get(
                `/products/${productId}/reviews?pageNumber=${pageNumber}&pageSize=${pageSize}`
            );
            console.log("Reviews fetched:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching reviews:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const createReview = createAsyncThunk(
    "reviews/createReview",
    async (req: CreateReviewReq, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/products/${req.productId}/reviews`,
                req,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                }
            );
            console.log("Review created:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error creating review:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const deleteReview = createAsyncThunk(
    "reviews/deleteReview",
    async (reviewId: number, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("Review deleted:", response.data);
            return { reviewId, message: response.data.message }; // Return ID to filter out
        } catch (error: any) {
            console.error("Error deleting review:", error);
            return rejectWithValue(error.message);
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH REVIEWS
        builder.addCase(fetchReviewsByProductId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
            state.loading = false;
            const data = action.payload; // ApiResponse
            if (data.status) { // Assuming backend sends {status: true, response: Page<Review>}
                // Check backend response structure in controller. 
                // Controller: new ApiResponse<>(true, "...", reviews, ...)
                // "reviews" is a Page object inside the ApiResponse.
                const page = data.data; // Use 'data' instead of 'response'
                if (page && page.content) {
                    state.reviews = page.content;
                    state.page = {
                        pageNumber: page.number,
                        pageSize: page.size,
                        totalPages: page.totalPages,
                        totalElements: page.totalElements,
                        isLast: page.last
                    };
                } else if (Array.isArray(page)) {
                    // In case it returns list
                    state.reviews = page;
                }
            }
        });
        builder.addCase(fetchReviewsByProductId.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to fetch reviews";
        });

        // CREATE REVIEW
        builder.addCase(createReview.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createReview.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.success) { // Use 'success' or 'status' check
                state.reviews.unshift(action.payload.data); // Use 'data' instead of 'response'
            }
        });
        builder.addCase(createReview.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to create review";
        });

        // DELETE REVIEW
        builder.addCase(deleteReview.fulfilled, (state, action) => {
            // remove from list
            state.reviews = state.reviews.filter(r => r.id !== action.payload.reviewId);
        });
    },
});

export default reviewSlice.reducer;
