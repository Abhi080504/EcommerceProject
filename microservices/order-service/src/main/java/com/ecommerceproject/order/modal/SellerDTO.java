package com.ecommerceproject.order.modal;

import lombok.Data;

@Data
public class SellerDTO {
    private Long id;
    private String sellerName;
    private String email;
    private String mobile;
    private String GSTIN;
}
