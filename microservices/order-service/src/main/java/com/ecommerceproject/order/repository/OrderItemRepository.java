package com.ecommerceproject.order.repository;

import com.ecommerceproject.order.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
