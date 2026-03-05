package com.ecommerceproject.user.service;

import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.modal.Wishlist;
import com.ecommerceproject.user.dto.ProductDTO;

public interface WishlistService {
    Wishlist createWishlist(User user);

    Wishlist getWishlistByUserId(User user);

    Wishlist addProductToWishlist(User user, ProductDTO product);
}
