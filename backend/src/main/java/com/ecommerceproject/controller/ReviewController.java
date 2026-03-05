package com.ecommerceproject.controller;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Review;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.request.CreateReviewRequest;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.ProductService;
import com.ecommerceproject.service.ReviewService;
import com.ecommerceproject.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

        private final ReviewService reviewService;
        private final UserService userService;
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
                        @RequestHeader("Authorization") String jwt) throws Exception {
                User user = userService.findUserByJwtToken(jwt);
                Product product = productService.findProductsById(productId);

                Review review = reviewService.createReview(req, user, product);

                ApiResponse<Review> response = new ApiResponse<>(true, "Review Created Successfully", review,
                                HttpStatus.CREATED.value());
                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @PatchMapping("/reviews/{reviewId}")
        public ResponseEntity<ApiResponse<Review>> updateReview(
                        @Valid @RequestBody CreateReviewRequest req,
                        @PathVariable Long reviewId,
                        @RequestHeader("Authorization") String jwt) throws Exception {

                User user = userService.findUserByJwtToken(jwt);

                Review review = reviewService.updateReview(reviewId,
                                req.getReviewText(),
                                req.getReviewRating(),
                                user.getId());

                ApiResponse<Review> response = new ApiResponse<>(true, "Review Updated Successfully", review,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/reviews/{reviewId}")
        public ResponseEntity<ApiResponse<String>> deleteReview(
                        @PathVariable Long reviewId,
                        @RequestHeader("Authorization") String jwt) throws Exception {

                User user = userService.findUserByJwtToken(jwt);

                reviewService.deleteReview(reviewId, user.getId());

                ApiResponse<String> res = new ApiResponse<>(true, "Review deleted successfully", null,
                                HttpStatus.OK.value());

                return ResponseEntity.ok(res);
        }

}
