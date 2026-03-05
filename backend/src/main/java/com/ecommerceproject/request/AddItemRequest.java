package com.ecommerceproject.request;

import lombok.Data;

@Data
public class AddItemRequest {
    private String size;

    @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @jakarta.validation.constraints.NotNull(message = "Product ID is required")
    private Long productId;
}
