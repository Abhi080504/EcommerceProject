package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Review;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.ReviewRepository;
import com.ecommerceproject.request.CreateReviewRequest;
import com.ecommerceproject.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final com.ecommerceproject.repository.ProductRepository productRepository; // Manual injection or ensure
                                                                                       // it's in constructor

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Review createReview(CreateReviewRequest req, User user, Product product) {
        product = productRepository.findById(product.getId()).orElse(product);
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImages());

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
    @org.springframework.transaction.annotation.Transactional
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review = getReviewById(reviewId);

        if (review.getUser().getId() == userId) { // Use == for primitive long
            review.setReviewText(reviewText);
            review.setRating(rating);
            Review savedReview = reviewRepository.save(review);

            updateProductAverageRating(review.getProduct().getId());

            return savedReview;
        }
        throw new Exception("you can not update this review");
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (review.getUser().getId() == userId) { // Use == for primitive long
            Long productId = review.getProduct().getId();

            reviewRepository.delete(review);

            updateProductAverageRating(productId);

            return; // Fixed void return
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
