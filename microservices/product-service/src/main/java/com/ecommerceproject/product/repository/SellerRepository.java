package com.ecommerceproject.product.repository;

import com.ecommerceproject.product.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Read-only repository for seller email → ID resolution.
 */
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Seller findByEmailIgnoreCase(String email);
}
