package com.ecommerceproject.order.service.impl;

import com.ecommerceproject.order.domain.OrderStatus;
import com.ecommerceproject.order.domain.PaymentStatus;
import com.ecommerceproject.order.feign.ProductFeignClient;
import com.ecommerceproject.order.modal.*;
import com.ecommerceproject.order.repository.AddressRepository;
import com.ecommerceproject.order.repository.OrderItemRepository;
import com.ecommerceproject.order.repository.OrderRepository;
import com.ecommerceproject.order.service.OrderService;
import com.ecommerceproject.order.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductFeignClient productFeignClient;

    @Override
    public Set<Order> createOrder(Long userId, Address shippingAddress, Map<String, Object> cart) throws Exception {

        Address savedAddress = addressRepository.save(shippingAddress);

        List<Map<String, Object>> cartItems = (List<Map<String, Object>>) cart.get("cartItems");
        if (cartItems == null || cartItems.isEmpty()) {
            throw new Exception("Cart is empty");
        }

        Set<Order> orders = new HashSet<>();
        Map<Long, List<Map<String, Object>>> itemsBySeller = new HashMap<>();

        for (Map<String, Object> item : cartItems) {
            Long productId = ((Number) item.get("productId")).longValue();

            // Fetch product details using Feign Client
            ProductDTO product = productFeignClient.getProductById(productId);
            Long sellerId = product.getSellerId();

            itemsBySeller.computeIfAbsent(sellerId, k -> new ArrayList<>()).add(item);
        }

        for (Map.Entry<Long, List<Map<String, Object>>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<Map<String, Object>> items = entry.getValue();

            int totalOrderSellingPrice = items.stream().mapToInt(it -> ((Number) it.get("sellingPrice")).intValue())
                    .sum();
            int totalOrderMrpPrice = items.stream().mapToInt(it -> ((Number) it.get("mrpPrice")).intValue()).sum();
            int totalItemCount = items.stream().mapToInt(it -> ((Number) it.get("quantity")).intValue()).sum();

            Order order = new Order();
            order.setUserId(userId);
            order.setSellerId(sellerId);
            order.setTotalMrpPrice(totalOrderMrpPrice);
            order.setTotalSellingPrice(totalOrderSellingPrice);
            order.setTotalItem(totalItemCount);
            order.setShippingAddress(savedAddress);
            order.setOrderStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
            order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
            order.setDiscount(totalOrderMrpPrice - totalOrderSellingPrice);

            Order savedOrder = orderRepository.save(order);
            orders.add(savedOrder);

            for (Map<String, Object> item : items) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProductId(((Number) item.get("productId")).longValue());
                orderItem.setSize((String) item.get("size"));
                orderItem.setQuantity(((Number) item.get("quantity")).intValue());
                orderItem.setMrpPrice(((Number) item.get("mrpPrice")).intValue());
                orderItem.setSellingPrice(((Number) item.get("sellingPrice")).intValue());
                orderItem.setUserId(userId);

                savedOrder.getOrderItems().add(orderItem);
                orderItemRepository.save(orderItem);
            }
        }

        return orders;
    }

    @Override
    public Order findOrderById(long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(() -> new Exception("Order not found with id " + id));
    }

    @Override
    public Page<Order> usersOrderHistory(Long userId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return orderRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Order> sellersOrder(Long sellerId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return orderRepository.findBySellerId(sellerId, pageable);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, Long userId) throws Exception {
        Order order = findOrderById(orderId);
        if (!order.getUserId().equals(userId)) {
            throw new Exception("You do not have access to this order");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(() -> new Exception("Order item not found with id " + id));
    }
}
