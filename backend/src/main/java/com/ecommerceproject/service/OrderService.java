package com.ecommerceproject.service;

import com.ecommerceproject.domain.OrderStatus;
import com.ecommerceproject.modal.*;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import java.util.List;
import java.util.Set;

@Service
public interface OrderService {
    Set<Order> createOrder(User user, Address shippingAddress, Cart cart);

    Order findOrderById(long id) throws Exception;

    Page<Order> usersOrderHistory(Long userId, Integer pageNumber, Integer pageSize);

    Page<Order> sellersOrder(Long sellerId, Integer pageNumber, Integer pageSize);

    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;

    Order cancelOrder(Long orderId, User user) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;
}
