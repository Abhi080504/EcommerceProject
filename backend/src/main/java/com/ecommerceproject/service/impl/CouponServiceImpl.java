package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.Coupon;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.CartRepository;
import com.ecommerceproject.repository.CouponRepository;
import com.ecommerceproject.repository.UserRepository;
import com.ecommerceproject.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    @Override
    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {
        Coupon coupon = couponRepository.findByCode(code).stream().findFirst().orElse(null);
        Cart cart = cartRepository.findByUserId(user.getId());

        user = userRepository.findById(user.getId()).orElse(user);

        if (cart == null) {
            throw new Exception("cart not found");
        }

        if (coupon == null) {
            throw new Exception("coupon not valid");
        }

        // Check Redis for used coupon
        boolean isUsedInRedis = Boolean.TRUE
                .equals(redisTemplate.opsForSet().isMember("user_coupons:" + user.getId(), code));
        if (isUsedInRedis) {
            throw new Exception("coupon already used");
        }

        if (user.getUsedCoupons() != null && user.getUsedCoupons().contains(coupon)) {
            // Sync Redis if inconsistent
            redisTemplate.opsForSet().add("user_coupons:" + user.getId(), code);
            throw new Exception("coupon already used");
        }
        if (orderValue < coupon.getMinimumOrderValue()) {
            throw new Exception("coupon order less than minimum order value" + coupon.getMinimumOrderValue());
        }

        if (coupon.isActive() &&
                coupon.getValidityStartDate() != null &&
                coupon.getValidityEndDate() != null &&
                (LocalDate.now().isAfter(coupon.getValidityStartDate())
                        || LocalDate.now().isEqual(coupon.getValidityStartDate()))
                &&
                (LocalDate.now().isBefore(coupon.getValidityEndDate())
                        || LocalDate.now().isEqual(coupon.getValidityEndDate()))) {

            double totalAmount = 0;
            for (CartItem item : cart.getCartItems()) {
                if (item.getSellingPrice() != null) {
                    totalAmount += item.getSellingPrice();
                }
            }

            double discountedPrice = (totalAmount * coupon.getDiscountPercentage()) / 100;

            cart.setTotalSellingPrice(totalAmount - discountedPrice);
            cart.setCouponCode(code);
            cartRepository.save(cart);
            return cart;
        }
        throw new Exception("Coupon not valid");
    }

    @Override
    public Cart removeCoupon(String code, User user) throws Exception {
        Coupon coupon = couponRepository.findByCode(code).stream().findFirst().orElse(null);

        if (coupon == null) {
            throw new Exception("coupon not found");
        }
        Cart cart = cartRepository.findByUserId(user.getId());
        double totalAmount = 0;
        for (CartItem item : cart.getCartItems()) {
            if (item.getSellingPrice() != null) {
                totalAmount += item.getSellingPrice();
            }
        }

        cart.setTotalSellingPrice(totalAmount);
        cart.setCouponCode(null);

        return cartRepository.save(cart);
    }

    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepository.findById(id).orElseThrow(() -> new Exception("Coupon not found"));
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public void deleteCoupon(Long id) throws Exception {
        Coupon coupon = findCouponById(id);

        // Break relationship from User side (owning side)
        if (coupon.getUsedByUsers() != null) {
            for (User user : coupon.getUsedByUsers()) {
                user.getUsedCoupons().remove(coupon);
                userRepository.save(user); // Ensure update is flushed
            }
        }

        couponRepository.deleteById(id);
    }
}
