package com.ecommerceproject.review.service.impl;

import com.ecommerceproject.review.modal.Review;
import com.ecommerceproject.review.repository.ReviewRepository;
import com.ecommerceproject.review.request.CreateReviewRequest;
import com.ecommerceproject.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://user-service/api/users/";
    private static final String PRODUCT_SERVICE_URL = "http://product-service/api/products/";

    @Override
    @Transactional
    public Review createReview(CreateReviewRequest req, Long userId, Long productId) {
        Review review = new Review();
        review.setUserId(userId);
        review.setProductId(productId);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImages());

        // Fetch user name from user-service
        try {
            Map<String, Object> userRes = restTemplate.getForObject(USER_SERVICE_URL + userId, Map.class);
            if (userRes != null && userRes.get("data") != null) {
                Map<String, Object> userData = (Map<String, Object>) userRes.get("data");
                String fullName = (String) userData.get("fullName");
                review.setUserFullName(fullName);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch user name: " + e.getMessage());
            review.setUserFullName("Anonymous");
        }

        review = reviewRepository.save(review);
        updateProductAverageRating(productId);

        return review;
    }

    @Override
    public Page<Review> getReviewByProductId(Long productId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return reviewRepository.findByProductId(productId, pageable);
    }

    @Override
    @Transactional
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (review.getUserId().equals(userId)) {
            review.setReviewText(reviewText);
            review.setRating(rating);
            Review savedReview = reviewRepository.save(review);
            updateProductAverageRating(review.getProductId());
            return savedReview;
        }
        throw new Exception("you can not update this review");
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (review.getUserId().equals(userId)) {
            Long productId = review.getProductId();
            reviewRepository.delete(review);
            updateProductAverageRating(productId);
            return;
        }
        throw new Exception("You cant delete this review");
    }

    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(() -> new Exception("review not found"));
    }

    private void updateProductAverageRating(Long productId) {
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        long count = reviewRepository.countReviewsByProductId(productId);

        // Notify product-service to update its rating
        Map<String, Object> request = new HashMap<>();
        request.put("averageRating", avg != null ? avg : 0.0);
        request.put("numRatings", (int) count);

        try {
            restTemplate.put(PRODUCT_SERVICE_URL + productId + "/rating", request);
        } catch (Exception e) {
            // Log error but don't fail the review operation?
            // In a real system, we might use a message queue here.
            System.err.println("Failed to update product rating: " + e.getMessage());
        }
    }
}
