package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    java.util.List<Coupon> findByCode(String code);
}
