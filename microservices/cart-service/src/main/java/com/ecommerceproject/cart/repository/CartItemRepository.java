package com.ecommerceproject.cart.repository;

import com.ecommerceproject.cart.modal.Cart;
import com.ecommerceproject.cart.modal.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProductIdAndSize(Cart cart, Long productId, String size);
}
