package com.ecommerceproject.product.service;

import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.modal.Review;
import com.ecommerceproject.product.request.CreateReviewRequest;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Review createReview(CreateReviewRequest req, Long userId, String userFullName, Product product);

    Page<Review> getReviewByProductId(Long productId, Integer pageNumber, Integer pageSize);

    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;
}
