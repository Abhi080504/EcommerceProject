package com.ecommerceproject.modal;

import com.ecommerceproject.domain.PaymentStatus;
import lombok.Data;


@Data
public class PaymentDetails {

    private String paymentId;
    private String razorpayPaymentLinkId;
    private String razorpayPaymentLinkReference;
    private String razorpayPaymentLinkStatus;
    private String razorpayPaymentIdZWSP;
    private PaymentStatus status;




}
