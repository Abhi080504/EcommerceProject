package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Order;
import com.ecommerceproject.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

}
