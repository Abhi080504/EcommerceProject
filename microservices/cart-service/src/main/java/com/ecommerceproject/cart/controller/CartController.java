package com.ecommerceproject.cart.controller;

import com.ecommerceproject.cart.modal.Cart;
import com.ecommerceproject.cart.modal.CartItem;
import com.ecommerceproject.cart.request.AddItemRequest;
import com.ecommerceproject.cart.response.ApiResponse;
import com.ecommerceproject.cart.service.CartItemService;
import com.ecommerceproject.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

        private final CartService cartService;
        private final CartItemService cartItemService;

        @GetMapping
        public ResponseEntity<ApiResponse<Cart>> findUserCartHandler(@RequestHeader("x-user-id") Long userId) {
                Cart cart = cartService.findUserCart(userId);
                ApiResponse<Cart> response = new ApiResponse<>(true, "Cart Retrieved Successfully", cart,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/add")
        public ResponseEntity<ApiResponse<CartItem>> addItemToCart(
                        @RequestHeader("x-user-id") Long userId,
                        @RequestBody AddItemRequest req) {

                CartItem item = cartService.addCartItem(userId, req.getProductId(), req.getSize(), req.getQuantity());
                ApiResponse<CartItem> response = new ApiResponse<>(true, "Item Added to Cart Successfully", item,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }

        @DeleteMapping("/item/{cartItemId}")
        public ResponseEntity<ApiResponse<String>> deleteCartItemHandler(
                        @RequestHeader("x-user-id") Long userId,
                        @PathVariable Long cartItemId) throws Exception {

                cartItemService.removeCartItem(userId, cartItemId);
                ApiResponse<String> response = new ApiResponse<>(true, "Item removed from cart", null,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }

        @PutMapping("/item/{cartItemId}")
        public ResponseEntity<ApiResponse<CartItem>> updatedCartItemHandler(
                        @RequestHeader("x-user-id") Long userId,
                        @PathVariable Long cartItemId,
                        @RequestBody CartItem cartItem) throws Exception {

                CartItem updatedCartItem = cartItemService.updateCartItem(userId, cartItemId, cartItem);
                ApiResponse<CartItem> response = new ApiResponse<>(true, "Cart Item Updated", updatedCartItem,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }

        @PostMapping("/apply-coupon")
        public ResponseEntity<ApiResponse<Cart>> applyCoupon(
                        @RequestHeader("x-user-id") Long userId,
                        @RequestParam String apply,
                        @RequestParam String code,
                        @RequestParam double orderValue) throws Exception {

                Cart cart;
                if (apply.equals("true")) {
                        cart = cartService.applyCoupon(code, orderValue, userId);
                } else {
                        cart = cartService.removeCoupon(userId);
                }

                ApiResponse<Cart> response = new ApiResponse<>(true, "Coupon Operation Successful", cart,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }
}
