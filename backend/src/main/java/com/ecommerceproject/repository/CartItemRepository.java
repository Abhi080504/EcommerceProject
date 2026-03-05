package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);

}
