package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.modal.Wishlist;
import com.ecommerceproject.repository.WishlistRepository;
import com.ecommerceproject.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
    public Wishlist getWishlistByUserId(User user) throws Exception {
       Wishlist wishlist = wishlistRepository.findByUserId(user.getId());


        if(wishlist==null){
            wishlist=createWishlist(user);
        }

        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(User user, Product product) throws Exception {
        Wishlist wishlist=getWishlistByUserId(user);

        if(wishlist.getProducts().contains(product)){
            wishlist.getProducts().remove(product);
        }
        else wishlist.getProducts().add(product);

        return wishlistRepository.save(wishlist);
    }
}
