package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.Cart;
import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.Coupon;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.CartItemRepository;
import com.ecommerceproject.repository.CartRepository;
import com.ecommerceproject.repository.CouponRepository;
import com.ecommerceproject.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CouponRepository couponRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        Cart cart = findUserCart(user);

        CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);
        if (isPresent == null) {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSize(size);

            int totalPrice = quantity * product.getSellingPrice();
            cartItem.setSellingPrice(totalPrice);
            cartItem.setMrpPrice(quantity * product.getMrpPrice());

            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);

            CartItem savedItem = cartItemRepository.save(cartItem);

            // Sync to Redis
            updateRedisCart(cart);

            return savedItem;
        }

        return isPresent;
    }

    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        int totalPrice = 0;
        int totalDiscountPrice = 0;
        int totalItem = 0;

        for (CartItem cartItem : cart.getCartItems()) {
            totalPrice += cartItem.getMrpPrice();
            totalDiscountPrice += cartItem.getSellingPrice();
            totalItem += cartItem.getQuantity();
        }

        cart.setTotalMrpPrice(totalPrice);
        cart.setTotalItem(totalItem);
        cart.setTotalSellingPrice(totalDiscountPrice);
        cart.setDiscount(calculateDiscountPercentage(totalPrice, totalDiscountPrice));
        cart.setTotalItem(totalItem);

        if (cart.getCouponCode() != null) {
            Coupon coupon = couponRepository.findByCode(cart.getCouponCode()).stream().findFirst().orElse(null);
            if (coupon != null && coupon.isActive()) {
                double discountedPrice = (cart.getTotalSellingPrice() * coupon.getDiscountPercentage()) / 100;
                cart.setTotalSellingPrice(cart.getTotalSellingPrice() - discountedPrice);
            }
        }

        // Cache this calculated cart state if needed, or rely on individual item
        // updates
        // For now, adhering to 'Add to DB -> Update Redis' strategy in addCartItem,
        // but findUserCart logic here recalculates totals every time which is safer for
        // coupons/price changes.

        return cart;
    }

    private void updateRedisCart(Cart cart) {
        // Placeholder: Implementation can be expanded to full Redis Hash management
        // based on specific requirements. For now, we ensure DB persistence is primary.
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0 || sellingPrice < 0) {
            return 0; // SAFE default
        }

        int discount = mrpPrice - sellingPrice;

        return (discount * 100) / mrpPrice;
    }
}
