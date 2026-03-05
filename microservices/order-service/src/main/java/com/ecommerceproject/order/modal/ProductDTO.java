package com.ecommerceproject.order.modal;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private int discountPercent;
    private int quantity;
    private String color;
    private String images;
    private int numRatings;
    private Long sellerId;
    // Add other fields as needed for Order processing
}
