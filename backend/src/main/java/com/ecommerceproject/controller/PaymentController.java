package com.ecommerceproject.controller;

import com.ecommerceproject.modal.*;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.response.PaymentLinkResponse;
import com.ecommerceproject.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final SellerService sellerService;
    private final OrderService orderService;
    private final SellerReportService sellerReportService;
    private final TransactionService transactionService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentLinkResponse>> paymentSuccessHandler(
            @PathVariable String paymentId,
            @RequestParam String paymentLinkId) throws Exception {

        User user = userService.findUserByJwtToken(null);

        PaymentLinkResponse paymentLinkResponse;

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);

        boolean paymentSuccess = paymentService.ProceedPaymentOrder(
                paymentOrder,
                paymentId,
                paymentLinkId);
        if (paymentSuccess) {
            for (Order order : paymentOrder.getOrders()) {
                transactionService.createTransaction(order);
                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport report = sellerReportService.getSellerReport(seller);
                report.setTotalEarnings(report.getTotalOrders() + 1);
                report.setTotalEarnings(report.getTotalEarnings() + order.getTotalSellingPrice());
                report.setTotalSales(report.getTotalSales() + order.getOrderItems().size());
                sellerReportService.updateSellerReport(report);

            }
        }

        ApiResponse<PaymentLinkResponse> res = new ApiResponse<>(true, "Payment Successful", null,
                HttpStatus.CREATED.value());

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

}
