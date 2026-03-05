package com.ecommerceproject.coupon.service;

import com.ecommerceproject.coupon.modal.Coupon;
import java.util.List;

public interface CouponService {
    Coupon validateCoupon(String code, double orderValue, Long userId) throws Exception;

    void useCoupon(String code, Long userId) throws Exception;

    Coupon findCouponById(Long id) throws Exception;

    Coupon createCoupon(Coupon coupon);

    List<Coupon> findAllCoupons();

    void deleteCoupon(Long id) throws Exception;
}
