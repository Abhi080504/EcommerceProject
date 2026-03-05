package com.ecommerceproject.cart.service.impl;

import com.ecommerceproject.cart.modal.CartItem;
import com.ecommerceproject.cart.repository.CartItemRepository;
import com.ecommerceproject.cart.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item = findCartItemById(id);

        if (item.getUserId().equals(userId)) {
            // Calculate unit prices before updating quantity
            int oldQuantity = item.getQuantity();
            int unitSellingPrice = oldQuantity > 0 ? item.getSellingPrice() / oldQuantity : 0;
            int unitMrpPrice = oldQuantity > 0 ? item.getMrpPrice() / oldQuantity : 0;

            item.setQuantity(cartItem.getQuantity());
            item.setSellingPrice(item.getQuantity() * unitSellingPrice);
            item.setMrpPrice(item.getQuantity() * unitMrpPrice);

            return cartItemRepository.save(item);
        }
        throw new Exception("You can't update another user's cart item");
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws Exception {
        CartItem item = findCartItemById(cartItemId);
        if (item.getUserId().equals(userId)) {
            cartItemRepository.delete(item);
        } else {
            throw new Exception("You can't remove another user's cart item");
        }
    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new Exception("Cart item not found with id " + id));
    }
}
