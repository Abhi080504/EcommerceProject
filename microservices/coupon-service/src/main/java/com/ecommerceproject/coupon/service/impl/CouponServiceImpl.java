package com.ecommerceproject.coupon.service.impl;

import com.ecommerceproject.coupon.modal.Coupon;
import com.ecommerceproject.coupon.modal.CouponUsage;
import com.ecommerceproject.coupon.repository.CouponRepository;
import com.ecommerceproject.coupon.repository.CouponUsageRepository;
import com.ecommerceproject.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    @Override
    public Coupon validateCoupon(String code, double orderValue, Long userId) throws Exception {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new Exception("Coupon not valid"));

        if (!coupon.isActive()) {
            throw new Exception("Coupon is not active");
        }

        // Check Redis for used coupon with resiliency
        boolean isUsedInRedis = false;
        try {
            isUsedInRedis = Boolean.TRUE
                    .equals(redisTemplate.opsForSet().isMember("user_coupons:" + userId, code));
        } catch (Exception e) {
            System.err.println("⚠️ [CouponServiceImpl] Redis check failed: " + e.getMessage());
        }

        if (isUsedInRedis || couponUsageRepository.existsByUserIdAndCoupon_Code(userId, code)) {
            // Sync Redis if inconsistent (silent fail if Redis down)
            try {
                redisTemplate.opsForSet().add("user_coupons:" + userId, code);
            } catch (Exception e) {
            }
            throw new Exception("Coupon already used");
        }

        if (orderValue < coupon.getMinimumOrderValue()) {
            throw new Exception("Order value less than minimum required: " + coupon.getMinimumOrderValue());
        }

        LocalDate now = LocalDate.now();
        if (now.isBefore(coupon.getValidityStartDate()) || now.isAfter(coupon.getValidityEndDate())) {
            throw new Exception("Coupon has expired or is not yet valid");
        }

        return coupon;
    }

    @Override
    public void useCoupon(String code, Long userId) throws Exception {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new Exception("Coupon not valid"));

        if (couponUsageRepository.existsByUserIdAndCoupon_Code(userId, code)) {
            throw new Exception("Coupon already used");
        }

        CouponUsage usage = new CouponUsage();
        usage.setUserId(userId);
        usage.setCoupon(coupon);
        couponUsageRepository.save(usage);

        // Update Redis (resilient failure)
        try {
            redisTemplate.opsForSet().add("user_coupons:" + userId, code);
        } catch (Exception e) {
            System.err.println("⚠️ [CouponServiceImpl] Redis update failed: " + e.getMessage());
        }
    }

    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepository.findById(id).orElseThrow(() -> new Exception("Coupon not found"));
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {
        if (coupon.getValidityStartDate() != null && coupon.getValidityEndDate() != null) {
            if (coupon.getValidityStartDate().isAfter(coupon.getValidityEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
        }
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public void deleteCoupon(Long id) throws Exception {
        Coupon coupon = findCouponById(id);
        couponRepository.delete(coupon);
    }
}
