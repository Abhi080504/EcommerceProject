package com.ecommerceproject.service.impl;

import com.ecommerceproject.domain.OrderStatus;
import com.ecommerceproject.domain.PaymentStatus;
import com.ecommerceproject.modal.*;
import com.ecommerceproject.repository.AddressRepository;
import com.ecommerceproject.repository.CouponRepository;
import com.ecommerceproject.repository.OrderItemRepository;
import com.ecommerceproject.repository.OrderRepository;
import com.ecommerceproject.repository.UserRepository;
import com.ecommerceproject.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    @Override
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

        Address address = addressRepository.save(shippingAddress);
        user.getAddresses().add(address);
        userRepository.save(user);

        if (cart.getCouponCode() != null) {
            Coupon coupon = couponRepository.findByCode(cart.getCouponCode()).stream().findFirst().orElse(null);
            if (coupon != null) {
                user.getUsedCoupons().add(coupon);
                userRepository.save(user);

                // Sync to Redis: Mark coupon as used for this user
                redisTemplate.opsForSet().add("user_coupons:" + user.getId(), cart.getCouponCode());
            }
        }

        // brand 1 => 3 shirt
        // brand 2 => 4 pants
        // brand 3 => 1 watch

        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

        Set<Order> orders = new HashSet<>();

        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            int totalOrderPrice = items.stream().mapToInt(
                    CartItem::getSellingPrice).sum();
            int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();

            Order createdOrder = new Order();
            createdOrder.setUser(user);
            createdOrder.setSellerId(sellerId);
            createdOrder.setTotalMrpPrice(totalOrderPrice);
            createdOrder.setTotalSellingPrice(totalOrderPrice);
            createdOrder.setTotalItem(totalItem);
            createdOrder.setShippingAddress(address);
            createdOrder.setOrderStatus(OrderStatus.PENDING);
            createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

            Order savedOrder = orderRepository.save(createdOrder);
            orders.add(savedOrder);

            List<OrderItem> orderItems = new ArrayList<>();

            for (CartItem item : items) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setSize(item.getSize());
                orderItem.setUserId(item.getUserId());
                orderItem.setSellingPrice(item.getSellingPrice());
                orderItem.setProduct(item.getProduct());

                savedOrder.getOrderItems().add(orderItem);

                OrderItem savedOrderItem = orderItemRepository.save(orderItem);
                orderItems.add(savedOrderItem);
            }
        }
        return orders;
    }

    @Override
    public Order findOrderById(long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(() -> new Exception("Order not Found..."));
    }

    @Override
    public Page<Order> usersOrderHistory(Long userId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return orderRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Order> sellersOrder(Long sellerId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return orderRepository.findBySellerId(sellerId, pageable);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws Exception {
        Order order = findOrderById(orderId);

        if (!(user.getId() == order.getUser().getId())) {
            throw new Exception("You do not have access to this order");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(() -> new Exception("Order item does not exist "));
    }
}
