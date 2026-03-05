package com.ecommerceproject.controller;

import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.modal.Wishlist;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.ProductService;
import com.ecommerceproject.service.UserService;
import com.ecommerceproject.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping()
    public ResponseEntity<ApiResponse<Wishlist>> getWishlistByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);

        ApiResponse<Wishlist> response = new ApiResponse<>(true, "Wishlist Retrieved", wishlist, HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Product product = productService.findProductsById(productId);
        User user = userService.findUserByJwtToken(jwt);
        Wishlist updatedWishlist = wishlistService.addProductToWishlist(
                user,
                product);

        ApiResponse<Wishlist> response = new ApiResponse<>(true, "Item Added to Wishlist", updatedWishlist,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }
}
