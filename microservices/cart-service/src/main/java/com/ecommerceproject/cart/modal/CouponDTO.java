package com.ecommerceproject.cart.modal;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CouponDTO {
    private long id;
    private String code;
    private double discountPercentage;
    private LocalDate validityStartDate;
    private LocalDate validityEndDate;
    private double minimumOrderValue;
    private boolean isActive;
}
