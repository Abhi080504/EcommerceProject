package com.ecommerceproject.order.controller;

import com.ecommerceproject.order.domain.PaymentMethod;
import com.ecommerceproject.order.feign.CartFeignClient;
import com.ecommerceproject.order.feign.UserFeignClient;
import com.ecommerceproject.order.modal.*;
import com.ecommerceproject.order.repository.PaymentOrderRepository;
import com.ecommerceproject.order.response.ApiResponse;
import com.ecommerceproject.order.response.PaymentLinkResponse;
import com.ecommerceproject.order.service.OrderService;
import com.ecommerceproject.order.service.PaymentService;
import com.razorpay.PaymentLink;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;
    private final UserFeignClient userFeignClient;
    private final CartFeignClient cartFeignClient;

    @PostMapping()
    public ResponseEntity<ApiResponse<PaymentLinkResponse>> createOrderHandler(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @Valid @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod) throws Exception {

        // Fetch User Full Name using Feign/Service
        // Simplified: Use Email split as fallback or Feign if JWT is present
        String fullName = userEmail.split("@")[0];
        // Note: For real profile, we can call userFeignClient.getUserProfile(jwt)

        // Fetch Cart from cart-service
        ApiResponse<Map<String, Object>> cartResponse = cartFeignClient.getCart(userId);
        Map<String, Object> cart = cartResponse.getData();

        Set<Order> orders = orderService.createOrder(userId, shippingAddress, cart);
        PaymentOrder paymentOrder = paymentService.createOrder(userId, userEmail, fullName, orders);

        PaymentLinkResponse res = new PaymentLinkResponse();

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            PaymentLink payment = paymentService.createRazorpayPaymentLink(userEmail, fullName,
                    paymentOrder.getAmount(),
                    paymentOrder.getId());

            String paymentUrl = payment.get("short_url");
            String paymentUrlId = payment.get("id");

            res.setPayment_link_url(paymentUrl);
            res.setPayment_link_id(paymentUrlId);

            paymentOrder.setPaymentLinkId(paymentUrlId);
            paymentOrderRepository.save(paymentOrder);
        } else {
            String paymentUrl = paymentService.createStripePaymentLink(userEmail, fullName,
                    paymentOrder.getAmount(),
                    paymentOrder.getId());
            res.setPayment_link_url(paymentUrl);
        }

        ApiResponse<PaymentLinkResponse> response = new ApiResponse<>(true, "Order Created Successfully", res,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<Iterable<Order>>> userOrderHistory(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws Exception {

        var orders = orderService.usersOrderHistory(userId, pageNumber, pageSize);
        ApiResponse<Iterable<Order>> response = new ApiResponse<>(true, "User Orders Retrieved", orders,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) throws Exception {

        Order order = orderService.findOrderById(orderId);
        if (!order.getUserId().equals(userId)) {
            throw new Exception("Access Denied");
        }
        ApiResponse<Order> response = new ApiResponse<>(true, "Order Retrieved", order, HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
