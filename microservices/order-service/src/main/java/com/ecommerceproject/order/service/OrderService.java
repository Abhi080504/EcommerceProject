package com.ecommerceproject.order.service;

import com.ecommerceproject.order.domain.OrderStatus;
import com.ecommerceproject.order.modal.Address;
import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.modal.OrderItem;
import org.springframework.data.domain.Page;
import java.util.Set;
import java.util.Map;
import java.util.List;

public interface OrderService {
    Set<Order> createOrder(Long userId, Address shippingAddress, Map<String, Object> cart) throws Exception;

    Order findOrderById(long id) throws Exception;

    Page<Order> usersOrderHistory(Long userId, Integer pageNumber, Integer pageSize);

    Page<Order> sellersOrder(Long sellerId, Integer pageNumber, Integer pageSize);

    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;

    Order cancelOrder(Long orderId, Long userId) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;
}
