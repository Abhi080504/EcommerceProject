package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.CartItem;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.CartItemRepository;
import com.ecommerceproject.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {


    private  final CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item= findCartItemById(id);

        User cartItemUser=item.getCart().getUser();

        if(cartItemUser.getId()==userId){
            item.setQuantity(cartItem.getQuantity());
            item.setMrpPrice(item.getQuantity()*item.getProduct().getMrpPrice());
            item.setSellingPrice(item.getQuantity()*item.getProduct().getSellingPrice());
            return cartItemRepository.save(item);
        }

        throw new Exception("you can not update this cartItem");
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws Exception {
        CartItem item=findCartItemById(cartItemId);

        User cartItemUser=item.getCart().getUser();

        if(cartItemUser.getId()==userId){
            cartItemRepository.delete(item);
        }
        else throw new Exception("You cannot delete this Item");

    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {

        return cartItemRepository.findById(id).orElseThrow(()->
                new Exception("cart item not found with id "+id));
    }


}
