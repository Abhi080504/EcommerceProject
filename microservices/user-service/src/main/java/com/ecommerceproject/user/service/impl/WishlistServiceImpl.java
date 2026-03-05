package com.ecommerceproject.user.service.impl;

import com.ecommerceproject.user.dto.ProductDTO;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.modal.Wishlist;
import com.ecommerceproject.user.repository.WishlistRepository;
import com.ecommerceproject.user.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public Wishlist getWishlistByUserId(User user) {
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId());
        if (wishlist == null) {
            wishlist = createWishlist(user);
        }
        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(User user, ProductDTO product) {
        Wishlist wishlist = getWishlistByUserId(user);
        if (wishlist.getProductIds().contains(product.getId())) {
            wishlist.getProductIds().remove(product.getId());
        } else {
            wishlist.getProductIds().add(product.getId());
        }
        return wishlistRepository.save(wishlist);
    }
}
