package com.ecommerceproject.controller;

import com.ecommerceproject.exceptions.ProductException;
import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.request.AddItemRequest;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.CartItemService;
import com.ecommerceproject.service.CartService;
import com.ecommerceproject.service.ProductService;
import com.ecommerceproject.service.UserService;
import jakarta.validation.Valid;
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
        private final UserService userService;
        private final ProductService productService;

        @GetMapping
        public ResponseEntity<ApiResponse<Cart>> findUserCartHandler() throws Exception {
                User user = userService.findUserByJwtToken(null);

                Cart cart = cartService.findUserCart(user);

                ApiResponse<Cart> response = new ApiResponse<>(true, "Cart Retrieved Successfully", cart,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/add")
        public ResponseEntity<ApiResponse<CartItem>> addItemToCart(@Valid @RequestBody AddItemRequest req)
                        throws ProductException, Exception {

                User user = userService.findUserByJwtToken(null);
                Product product = productService.findProductsById(req.getProductId());

                CartItem item = cartService.addCartItem(user,
                                product,
                                req.getSize(),
                                req.getQuantity());

                ApiResponse<CartItem> response = new ApiResponse<>(true, "Item Added to Cart Successfully", item,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }

        @DeleteMapping("/item/{cartItemId}")
        public ResponseEntity<ApiResponse<String>> deleteCartItemHandler(
                        @PathVariable Long cartItemId)
                        throws Exception {

                User user = userService.findUserByJwtToken(null);
                cartItemService.removeCartItem(user.getId(), cartItemId);

                ApiResponse<String> response = new ApiResponse<>(true, "Item removed from cart", null,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }

        @PutMapping("/item/{cartItemId}")
        public ResponseEntity<ApiResponse<CartItem>> updatedCartItemHandler(
                        @PathVariable Long cartItemId,
                        @Valid @RequestBody CartItem cartItem) throws Exception {

                User user = userService.findUserByJwtToken(null);

                CartItem updatedCartItem = null;
                if (cartItem.getQuantity() > 0) {
                        updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
                }

                ApiResponse<CartItem> response = new ApiResponse<>(true, "Cart Item Updated", updatedCartItem,
                                HttpStatus.ACCEPTED.value());
                return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        }
}
