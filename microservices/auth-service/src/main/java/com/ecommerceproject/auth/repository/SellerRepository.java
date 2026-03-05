package com.ecommerceproject.auth.repository;

import com.ecommerceproject.auth.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Seller findByEmail(String email);

    Seller findByEmailIgnoreCase(String email);

    java.util.List<Seller> findByAccountStatus(com.ecommerceproject.auth.domain.AccountStatus status);
}
