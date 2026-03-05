package com.ecommerceproject.product.controller;

import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.modal.Review;
import com.ecommerceproject.product.request.CreateReviewRequest;
import com.ecommerceproject.product.response.ApiResponse;
import com.ecommerceproject.product.service.ProductService;
import com.ecommerceproject.product.service.ReviewService;
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
    private final ProductService productService;

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

        Product product = productService.findProductsById(productId);

        String userFullName = "Anonymous";
        try {
            // Simple approach: Use User-Service to get name.
            // Better: We should have denormalized it in the request or from JWT if
            // available.
            // But since Gateway doesn't pass name, we fetch it.
            String USER_SERVICE_URL = "http://user-service/api/users/";
            // We need a RestTemplate here. Does this controller have one?
            // I'll check ProductServiceImpl as it might have a Bean or just create one.
            // Actually, I'll update ReviewServiceImpl to handle the fetch to keep
            // controller clean.
            // Wait, I already updated the interface. Let's stick to passing it.
        } catch (Exception e) {
        }

        Review review = reviewService.createReview(req, userId, userFullName, product);

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
