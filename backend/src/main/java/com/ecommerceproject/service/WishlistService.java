package com.ecommerceproject.service;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.modal.Wishlist;

public interface WishlistService {
    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user) throws Exception;
    Wishlist addProductToWishlist(User user, Product product) throws Exception;
}
