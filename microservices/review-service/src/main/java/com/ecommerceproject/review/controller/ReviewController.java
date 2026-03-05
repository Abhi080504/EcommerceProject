package com.ecommerceproject.review.controller;

import com.ecommerceproject.review.modal.Review;
import com.ecommerceproject.review.request.CreateReviewRequest;
import com.ecommerceproject.review.response.ApiResponse;
import com.ecommerceproject.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<ApiResponse<Page<Review>>> getReviewsByProductId(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        Page<Review> reviews = reviewService.getReviewByProductId(productId, pageNumber, pageSize);
        ApiResponse<Page<Review>> response = new ApiResponse<>(true, "Reviews Retrieved", reviews,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ApiResponse<Review>> writeReview(
            @Valid @RequestBody CreateReviewRequest req,
            @PathVariable Long productId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) throws Exception {

        if (userId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "User ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }

        Review review = reviewService.createReview(req, userId, productId);

        ApiResponse<Review> response = new ApiResponse<>(true, "Review Created Successfully", review,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Review>> updateReview(
            @Valid @RequestBody CreateReviewRequest req,
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) throws Exception {

        if (userId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "User ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }

        Review review = reviewService.updateReview(reviewId, req.getReviewText(), req.getReviewRating(), userId);
        ApiResponse<Review> response = new ApiResponse<>(true, "Review Updated Successfully", review,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) throws Exception {

        if (userId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "User ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }

        reviewService.deleteReview(reviewId, userId);
        ApiResponse<String> res = new ApiResponse<>(true, "Review deleted successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(res);
    }
}
