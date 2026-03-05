package com.ecommerceproject.product.repository;

import com.ecommerceproject.product.modal.Deals;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deals, Long> {
}
