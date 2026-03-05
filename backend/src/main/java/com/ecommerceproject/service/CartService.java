package com.ecommerceproject.service;

import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;

public interface CartService {

    public CartItem addCartItem(
            User user,
            Product product,
            String size,
            int quanity
    );
    public Cart findUserCart(User user);


}
