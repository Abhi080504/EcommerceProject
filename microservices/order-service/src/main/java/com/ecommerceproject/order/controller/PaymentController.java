package com.ecommerceproject.order.controller;

import com.ecommerceproject.order.modal.PaymentOrder;
import com.ecommerceproject.order.response.ApiResponse;
import com.ecommerceproject.order.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Boolean>> paymentSuccessHandler(
            @PathVariable String paymentId,
            @RequestParam String paymentLinkId) throws Exception {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);
        boolean success = paymentService.proceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);

        ApiResponse<Boolean> response = new ApiResponse<>(success,
                success ? "Payment Successful" : "Payment Failed",
                success,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
