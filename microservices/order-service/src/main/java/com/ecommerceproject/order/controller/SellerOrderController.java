package com.ecommerceproject.order.controller;

import com.ecommerceproject.order.domain.OrderStatus;
import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.response.ApiResponse;
import com.ecommerceproject.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;

    @GetMapping()
    public ResponseEntity<ApiResponse<Page<Order>>> getAllOrdersHandler(
            @RequestHeader("X-Seller-Id") Long sellerId,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws Exception {

        Page<Order> orders = orderService.sellersOrder(sellerId, pageNumber, pageSize);
        ApiResponse<Page<Order>> response = new ApiResponse<>(true, "Seller Orders Retrieved", orders,
                HttpStatus.ACCEPTED.value());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<ApiResponse<Order>> updatedOrderHandler(
            @RequestHeader("X-Seller-Id") Long sellerId, // Verify seller ownership if needed
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus) throws Exception {

        Order order = orderService.findOrderById(orderId);
        if (order.getSellerId() != sellerId) {
            throw new Exception("Access Denied");
        }

        Order updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
        ApiResponse<Order> response = new ApiResponse<>(true, "Order Status Updated", updatedOrder,
                HttpStatus.ACCEPTED.value());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}
