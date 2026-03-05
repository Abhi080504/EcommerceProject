package com.ecommerceproject.order.service;

import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.modal.PaymentOrder;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import java.util.Set;
import java.util.Map;

public interface PaymentService {
    PaymentOrder createOrder(Long userId, String userEmail, String fullName, Set<Order> orders);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentLinkId) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId)
            throws RazorpayException;

    PaymentLink createRazorpayPaymentLink(String userEmail, String fullName, Long amount, Long orderId)
            throws RazorpayException;

    String createStripePaymentLink(String userEmail, String fullName, Long amount, Long orderId) throws StripeException;
}
