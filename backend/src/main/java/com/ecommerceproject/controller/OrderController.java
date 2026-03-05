package com.ecommerceproject.controller;

import com.ecommerceproject.domain.PaymentMethod;
import com.ecommerceproject.modal.*;
import com.ecommerceproject.repository.PaymentOrderRepository;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.response.PaymentLinkResponse;
import com.ecommerceproject.service.*;
import com.razorpay.PaymentLink;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

        private final OrderService orderService;
        private final UserService userService;
        private final CartService cartService;
        private final SellerReportService sellerReportService;
        private final SellerService sellerService;
        private final PaymentService paymentService;
        private final PaymentOrderRepository paymentOrderRepository;

        @PostMapping()
        public ResponseEntity<ApiResponse<PaymentLinkResponse>> createOrderHandler(
                        @Valid @RequestBody Address shippingAddress,
                        @RequestParam PaymentMethod paymentMethod) throws Exception {

                User user = userService.findUserByJwtToken(null);
                Cart cart = cartService.findUserCart(user);
                Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);

                PaymentOrder paymentOrder = paymentService.createOrder(user, orders);

                PaymentLinkResponse res = new PaymentLinkResponse();

                if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
                        PaymentLink payment = paymentService.createRazorpayPaymentLink(user,
                                        paymentOrder.getAmount(),
                                        paymentOrder.getId());

                        String paymentUrl = payment.get("short_url");
                        String paymentUrlId = payment.get("id");

                        System.out.println("Payment Link Generated: " + paymentUrl);

                        res.setPayment_link_url(paymentUrl);

                        paymentOrder.setPaymentLinkId(paymentUrlId);
                        paymentOrderRepository.save(paymentOrder);
                } else {
                        String paymentUrl = paymentService.createStripePaymentLink(user,
                                        paymentOrder.getAmount(),
                                        paymentOrder.getId());
                        res.setPayment_link_url(paymentUrl);
                }

                ApiResponse<PaymentLinkResponse> response = new ApiResponse<>(true, "Order Created Successfully", res,
                                HttpStatus.CREATED.value());
                return new ResponseEntity<>(response, HttpStatus.CREATED);

        }

        @GetMapping("/user")
        public ResponseEntity<ApiResponse<Page<Order>>> userOrderHistory(
                        @RequestParam(defaultValue = "0") Integer pageNumber,
                        @RequestParam(defaultValue = "10") Integer pageSize) throws Exception {

                User user = userService.findUserByJwtToken(null);
                Page<Order> orders = orderService.usersOrderHistory(user.getId(), pageNumber, pageSize);

                ApiResponse<Page<Order>> response = new ApiResponse<>(true, "User Orders Retrieved", orders,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);

        }

        @GetMapping("/{orderId}")
        public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId) throws Exception {

                User user = userService.findUserByJwtToken(null);
                Order orders = orderService.findOrderById(orderId);

                ApiResponse<Order> response = new ApiResponse<>(true, "Order Retrieved", orders, HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/item/{orderItemId}")
        public ResponseEntity<ApiResponse<OrderItem>> getOrderItemById(
                        @PathVariable Long orderItemId) throws Exception {
                System.out.println("--------Controller");

                User user = userService.findUserByJwtToken(null);
                OrderItem orderItem = orderService.getOrderItemById(orderItemId);

                ApiResponse<OrderItem> response = new ApiResponse<>(true, "Order Item Retrieved", orderItem,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/{orderId}/cancel")
        public ResponseEntity<ApiResponse<Order>> cancelOrder(
                        @PathVariable Long orderId) throws Exception {
                User user = userService.findUserByJwtToken(null);
                Order order = orderService.cancelOrder(orderId, user);

                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport report = sellerReportService.getSellerReport(seller);

                report.setCanceledOrders(report.getCanceledOrders() + 1);
                report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());
                sellerReportService.updateSellerReport(report);

                ApiResponse<Order> response = new ApiResponse<>(true, "Order Cancelled Successfully", order,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }

}
