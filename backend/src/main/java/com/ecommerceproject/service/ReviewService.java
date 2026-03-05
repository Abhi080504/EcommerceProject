package com.ecommerceproject.service;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Review;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.request.CreateReviewRequest;

import org.springframework.data.domain.Page;
import java.util.List;

public interface ReviewService {

    Review createReview(CreateReviewRequest req,
            User user,
            Product product);

    Page<Review> getReviewByProductId(Long productId, Integer pageNumber, Integer pageSize);

    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;
}
