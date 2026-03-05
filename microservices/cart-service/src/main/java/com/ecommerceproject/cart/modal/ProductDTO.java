package com.ecommerceproject.cart.modal;

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
    private java.util.List<String> images;
    private int numRatings;
}
