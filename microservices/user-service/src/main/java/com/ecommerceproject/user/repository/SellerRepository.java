package com.ecommerceproject.user.repository;

import com.ecommerceproject.user.domain.AccountStatus;
import com.ecommerceproject.user.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Seller findByEmail(String email);

    List<Seller> findByAccountStatus(AccountStatus status);

    long countByAccountStatus(AccountStatus status);
}
