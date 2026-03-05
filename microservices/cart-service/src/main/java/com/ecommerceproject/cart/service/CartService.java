package com.ecommerceproject.cart.service;

import com.ecommerceproject.cart.modal.Cart;
import com.ecommerceproject.cart.modal.CartItem;

public interface CartService {
    CartItem addCartItem(Long userId, Long productId, String size, int quantity);

    Cart findUserCart(Long userId);

    Cart applyCoupon(String code, double orderValue, Long userId) throws Exception;

    Cart removeCoupon(Long userId);
}
