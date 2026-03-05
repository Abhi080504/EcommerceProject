package com.ecommerceproject.cart.feign;

import com.ecommerceproject.cart.modal.CouponDTO;
import com.ecommerceproject.cart.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "coupon-service", url = "http://localhost:9006")
public interface CouponFeignClient {

    @GetMapping("/api/coupons/validate")
    ApiResponse<CouponDTO> validateCoupon(
            @RequestParam("code") String code,
            @RequestParam("orderValue") double orderValue,
            @RequestHeader("X-User-Id") Long userId);
}
