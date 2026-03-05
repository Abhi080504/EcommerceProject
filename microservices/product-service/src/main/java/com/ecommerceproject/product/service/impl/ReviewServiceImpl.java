package com.ecommerceproject.product.service.impl;

import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.modal.Review;
import com.ecommerceproject.product.repository.ProductRepository;
import com.ecommerceproject.product.repository.ReviewRepository;
import com.ecommerceproject.product.request.CreateReviewRequest;
import com.ecommerceproject.product.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://user-service/api/users/";

    @Override
    @Transactional
    public Review createReview(CreateReviewRequest req, Long userId, String userFullName, Product product) {
        product = productRepository.findById(product.getId()).orElse(product);
        Review review = new Review();
        review.setUserId(userId);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImages());

        // Fetch user name if not provided or to ensure it's up to date
        if (userFullName == null || userFullName.equals("Anonymous")) {
            try {
                java.util.Map<String, Object> userRes = restTemplate.getForObject(USER_SERVICE_URL + userId,
                        java.util.Map.class);
                if (userRes != null && userRes.get("data") != null) {
                    java.util.Map<String, Object> userData = (java.util.Map<String, Object>) userRes.get("data");
                    userFullName = (String) userData.get("fullName");
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch user name in product-service: " + e.getMessage());
            }
        }
        review.setUserFullName(userFullName);

        review = reviewRepository.save(review);
        updateProductAverageRating(product.getId());

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
            updateProductAverageRating(review.getProduct().getId());
            return savedReview;
        }
        throw new Exception("you can not update this review");
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (review.getUserId().equals(userId)) {
            Long productId = review.getProduct().getId();
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

        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            product.setAverageRating(avg != null ? avg : 0.0);
            product.setNumRatings((int) count);
            productRepository.save(product);
        }
    }
}
