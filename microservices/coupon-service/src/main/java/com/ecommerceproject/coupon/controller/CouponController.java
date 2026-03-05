package com.ecommerceproject.coupon.controller;

import com.ecommerceproject.coupon.modal.Coupon;
import com.ecommerceproject.coupon.response.ApiResponse;
import com.ecommerceproject.coupon.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Coupon>> validateCoupon(
            @RequestParam String code,
            @RequestParam double orderValue,
            @RequestHeader("X-User-Id") Long userId) throws Exception {

        Coupon coupon = couponService.validateCoupon(code, orderValue, userId);
        ApiResponse<Coupon> response = new ApiResponse<>(true, "Coupon is valid", coupon, HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/use")
    public ResponseEntity<ApiResponse<Void>> useCoupon(
            @RequestParam String code,
            @RequestHeader("X-User-Id") Long userId) throws Exception {

        couponService.useCoupon(code, userId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Coupon used successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    // Admin operations
    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody Coupon coupon) {
        Coupon createdCoupon = couponService.createCoupon(coupon);
        ApiResponse<Coupon> response = new ApiResponse<>(true, "Coupon Created Successfully", createdCoupon,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        ApiResponse<String> response = new ApiResponse<>(true, "Coupon deleted Successfully", null,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        List<Coupon> coupons = couponService.findAllCoupons();
        ApiResponse<List<Coupon>> response = new ApiResponse<>(true, "Coupons Retrieved", coupons,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }
}
