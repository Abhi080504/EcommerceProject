package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findBySellerId(Long sellerId);

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findBySellerId(Long sellerId, Pageable pageable);

}
