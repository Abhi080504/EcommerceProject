package com.ecommerceproject.controller;

import com.ecommerceproject.domain.OrderStatus;
import com.ecommerceproject.modal.Order;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.OrderService;
import com.ecommerceproject.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<ApiResponse<Page<Order>>> getAllOrdersHandler(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws Exception {
        Seller seller = sellerService.getSellerProfile(null);
        Page<Order> orders = orderService.sellersOrder(seller.getId(), pageNumber, pageSize);

        ApiResponse<Page<Order>> response = new ApiResponse<>(true, "Seller Orders Retrieved", orders,
                HttpStatus.ACCEPTED.value());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @PatchMapping("{orderId}/status/{orderStatus}")
    public ResponseEntity<ApiResponse<Order>> updatedOrderHandler(
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus) throws Exception {
        Order order = orderService.updateOrderStatus(orderId, orderStatus);

        ApiResponse<Order> response = new ApiResponse<>(true, "Order Status Updated", order,
                HttpStatus.ACCEPTED.value());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}
