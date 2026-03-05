package com.ecommerceproject.cart.service.impl;

import com.ecommerceproject.cart.feign.ProductFeignClient;
import com.ecommerceproject.cart.modal.Cart;
import com.ecommerceproject.cart.modal.CartItem;
import com.ecommerceproject.cart.modal.ProductDTO;
import com.ecommerceproject.cart.repository.CartItemRepository;
import com.ecommerceproject.cart.repository.CartRepository;
import com.ecommerceproject.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductFeignClient productFeignClient;
    private final com.ecommerceproject.cart.feign.CouponFeignClient couponFeignClient;

    @Override
    public CartItem addCartItem(Long userId, Long productId, String size, int quantity) {
        Cart cart = findUserCart(userId);

        CartItem isPresent = cartItemRepository.findByCartAndProductIdAndSize(cart, productId, size);

        if (isPresent == null) {
            // Fetch product details using Feign Client
            // Fetch product details using Feign Client
            ProductDTO product = productFeignClient.getProductById(productId).getData();

            CartItem cartItem = new CartItem();
            cartItem.setProductId(productId);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(userId);
            cartItem.setSize(size);

            int sellingPrice = product.getSellingPrice();
            int mrpPrice = product.getMrpPrice();

            cartItem.setSellingPrice(quantity * sellingPrice);
            cartItem.setMrpPrice(quantity * mrpPrice);

            cartItem.setCart(cart);
            cartItem.setProduct(product); // Populate transient field
            cart.getCartItems().add(cartItem);

            return cartItemRepository.save(cartItem);
        } else {
            // Refined price calculation to avoid division by zero
            int oldQuantity = isPresent.getQuantity();
            int unitSellingPrice = oldQuantity > 0 ? isPresent.getSellingPrice() / oldQuantity : 0;
            int unitMrpPrice = oldQuantity > 0 ? isPresent.getMrpPrice() / oldQuantity : 0;

            isPresent.setQuantity(isPresent.getQuantity() + quantity);
            isPresent.setSellingPrice(isPresent.getQuantity() * unitSellingPrice);
            isPresent.setMrpPrice(isPresent.getQuantity() * unitMrpPrice);

            return cartItemRepository.save(isPresent);
        }
    }

    @Override
    public Cart findUserCart(Long userId) {
        System.out.println("🛒 [CartServiceImpl] findUserCart for userId: " + userId);
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
            cart = cartRepository.save(cart);
        }

        int totalPrice = 0;
        int totalDiscountPrice = 0;
        int totalItem = 0;

        if (cart.getCartItems() != null) {
            for (CartItem cartItem : cart.getCartItems()) {
                totalPrice += cartItem.getMrpPrice();
                totalDiscountPrice += cartItem.getSellingPrice();
                totalItem += cartItem.getQuantity();
            }
            // Populate product details for each item
            cart.getCartItems().forEach(item -> {
                item.setProduct(productFeignClient.getProductById(item.getProductId()).getData());
            });
        }

        System.out.println(
                "🛒 [CartServiceImpl] recalulated totals: mrp=" + totalPrice + ", selling=" + totalDiscountPrice);
        cart.setTotalMrpPrice(totalPrice);
        cart.setTotalItem(totalItem);
        cart.setTotalSellingPrice(totalDiscountPrice);
        cart.setDiscount(calculateMonetaryDiscount(totalPrice, totalDiscountPrice));

        if (cart.getCouponCode() != null) {
            System.out.println(
                    "🎟️ [CartServiceImpl] trying to apply coupon: " + cart.getCouponCode() + " for userId: " + userId);
            try {
                System.out.println("🎟️ [CartServiceImpl] calling couponFeignClient.validateCoupon with orderValue: "
                        + totalDiscountPrice);
                com.ecommerceproject.cart.response.ApiResponse<com.ecommerceproject.cart.modal.CouponDTO> response = couponFeignClient
                        .validateCoupon(cart.getCouponCode(), (double) totalDiscountPrice, userId);

                System.out.println("🎟️ [CartServiceImpl] couponFeignClient response: " + response);

                if (response != null && response.isSuccess() && response.getData() != null) {
                    com.ecommerceproject.cart.modal.CouponDTO coupon = response.getData();
                    System.out.println("✅ [CartServiceImpl] coupon VALID: " + coupon.getDiscountPercentage() + "% off");
                    double discountedAmount = (cart.getTotalSellingPrice() * coupon.getDiscountPercentage()) / 100;
                    System.out.println("✅ [CartServiceImpl] discountedAmount: " + discountedAmount);
                    cart.setTotalSellingPrice(cart.getTotalSellingPrice() - discountedAmount);
                    // Aggregate coupon discount into the total discount monetary value
                    int couponDiscountMonetary = (int) Math.round(discountedAmount);
                    cart.setDiscount(cart.getDiscount() + couponDiscountMonetary);
                    System.out.println("✅ [CartServiceImpl] new totalSellingPrice: " + cart.getTotalSellingPrice()
                            + ", total discount: " + cart.getDiscount());
                } else {
                    String msg = response != null ? response.getMessage() : "Response was null";
                    System.out.println("❌ [CartServiceImpl] coupon INVALID or NULL data. Message: " + msg);
                    // Clear invalid coupon code but SAVE it below via cartRepository.save(cart)
                    cart.setCouponCode(null);
                }
            } catch (Exception e) {
                System.err.println("❌ [CartServiceImpl] coupon validation ERROR: " + e.getMessage());
                e.printStackTrace();
                // If coupon is invalid now (expired/etc), remove it
                cart.setCouponCode(null);
            }
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart applyCoupon(String code, double orderValue, Long userId) throws Exception {
        System.out.println("🎟️ [CartServiceImpl] applyCoupon called: code=" + code + ", userId=" + userId);
        Cart cart = cartRepository.findByUserId(userId);
        if (cart != null) {
            cart.setCouponCode(code);
            cartRepository.save(cart); // Persist BEFORE recalculating
            return findUserCart(userId); // Re-calculates with the code
        }
        System.out.println("❌ [CartServiceImpl] applyCoupon: Cart NOT FOUND for userId=" + userId);
        return cart;
    }

    @Override
    public Cart removeCoupon(Long userId) {
        System.out.println("🎟️ [CartServiceImpl] removeCoupon called for userId=" + userId);
        Cart cart = cartRepository.findByUserId(userId);
        if (cart != null) {
            cart.setCouponCode(null);
            cartRepository.save(cart); // Persist removal
            return findUserCart(userId); // Re-calculate to clear discount from totals
        }
        return cart;
    }

    private int calculateMonetaryDiscount(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            return 0;
        }
        return mrpPrice - sellingPrice; // Return monetary discount
    }

    public CartRepository getCartRepository() {
        return cartRepository;
    }
}
