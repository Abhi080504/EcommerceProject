package com.ecommerceproject.coupon.repository;

import com.ecommerceproject.coupon.modal.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    List<CouponUsage> findByUserId(Long userId);

    boolean existsByUserIdAndCoupon_Code(Long userId, String code);
}
