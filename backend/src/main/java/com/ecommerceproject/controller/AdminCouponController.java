package com.ecommerceproject.controller;

import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.Coupon;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.CartService;
import com.ecommerceproject.service.CouponService;
import com.ecommerceproject.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupons")
public class AdminCouponController {
    private final CouponService couponService;
    private final UserService userService;
    private final CartService cartService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<Cart>> applyCoupon(
            @RequestParam String apply,
            @RequestParam String code,
            @RequestParam double orderValue) throws Exception {

        User user = userService.findUserByJwtToken(null);
        Cart cart;

        if (apply.equals("true")) {
            cart = couponService.applyCoupon(code, orderValue, user);
        } else {
            cart = couponService.removeCoupon(code, user);
        }

        ApiResponse<Cart> response = new ApiResponse<>(true, "Coupon Operation Successful", cart,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    // Admin operations

    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody Coupon coupon) {
        Coupon createCoupon = couponService.createCoupon(coupon);

        ApiResponse<Coupon> response = new ApiResponse<>(true, "Coupon Created Successfully", createCoupon,
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
