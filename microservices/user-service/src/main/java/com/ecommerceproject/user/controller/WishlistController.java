package com.ecommerceproject.user.controller;

import com.ecommerceproject.user.dto.ProductDTO;
import com.ecommerceproject.user.feign.ProductFeignClient;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.modal.Wishlist;
import com.ecommerceproject.user.response.ApiResponse;
import com.ecommerceproject.user.service.UserService;
import com.ecommerceproject.user.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductFeignClient productFeignClient;

    @GetMapping()
    public ResponseEntity<ApiResponse<WishlistDTO>> getWishlistByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);

        // Hydrate Products
        Set<ProductDTO> products = new HashSet<>();
        for (Long productId : wishlist.getProductIds()) {
            try {
                ProductDTO product = productFeignClient.getProductById(productId);
                products.add(product);
            } catch (Exception e) {
                System.out.println("Product not found or service down: " + productId);
            }
        }

        WishlistDTO responseDto = new WishlistDTO(wishlist.getId(), user, products);

        ApiResponse<WishlistDTO> response = new ApiResponse<>(true, "Wishlist Retrieved", responseDto,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        ProductDTO product = productFeignClient.getProductById(productId); // Verify product exists

        Wishlist updatedWishlist = wishlistService.addProductToWishlist(user, product);

        // Hydrate for response
        Set<ProductDTO> products = new HashSet<>();
        for (Long pid : updatedWishlist.getProductIds()) {
            try {
                if (pid.equals(productId)) {
                    products.add(product); // Optimization
                } else {
                    products.add(productFeignClient.getProductById(pid));
                }
            } catch (Exception e) {
            }
        }

        WishlistDTO responseDto = new WishlistDTO(updatedWishlist.getId(), user, products);

        ApiResponse<WishlistDTO> response = new ApiResponse<>(true, "Item Added to Wishlist", responseDto,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    // Helper DTO class for Response
    @lombok.Data
    @lombok.AllArgsConstructor
    static class WishlistDTO {
        private Long id;
        private User user;
        private Set<ProductDTO> products;
    }
}
