package com.ecommerceproject.review.service;

import com.ecommerceproject.review.modal.Review;
import com.ecommerceproject.review.request.CreateReviewRequest;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Review createReview(CreateReviewRequest req, Long userId, Long productId);

    Page<Review> getReviewByProductId(Long productId, Integer pageNumber, Integer pageSize);

    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;
}
