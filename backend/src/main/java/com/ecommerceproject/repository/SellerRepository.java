package com.ecommerceproject.repository;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {

    Seller findByEmail(String email);

    List<Seller> findByAccountStatus(AccountStatus status);

    long countByAccountStatus(AccountStatus status);

}
