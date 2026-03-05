package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);

    Page<Review> findByProductId(Long productId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    long countReviewsByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);
}
